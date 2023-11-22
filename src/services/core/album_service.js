const { nanoid } = require('nanoid');

const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const DatabasePool = require('../../database/database_pool');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelAlbum } = require('../../utils/util');

class AlbumService {
  constructor(redisService) {
    this._redisService = redisService;
    this._pool = new DatabasePool();
  }

  async createNewAlbum({
    name,
    year,
  }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows[0].id) {
      throw new ClientError('Album failed to create');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    return result.rows.map(mapDBToModelAlbum)[0];
  }

  async editAlbumById(id, {
    name,
    year,
  }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. Id not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album failed to delete. Id not found.');
    }
  }

  async addAlbumLikes(userId, albumId) {
    const id = `album_likes-${nanoid(16)}`;
    await this.getAlbumById(albumId);

    const checkLikes = await this.checkAlbumLikes(userId, albumId);

    if (checkLikes) {
      throw new ClientError('You have liked this album');
    } else {
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      const result = await this._pool.executeQuery(query);
      if (!result.rows[0].id) {
        throw new InvariantError('Failed to add liked album');
      }

      await this._redisService.delete(`album_likes:${albumId}`);
      return result.rows[0].id;
    }
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to removed the liked album. Id not found');
    }

    await this._redisService.delete(`album_likes:${albumId}`);
  }

  async checkAlbumLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.executeQuery(query);

    return result.rows.length;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._redisService.get(`album_likes:${albumId}`);
      return { count: JSON.parse(result), isCache: 1 };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE "albumId" = $1',
        values: [albumId],
      };

      const result = await this._pool.executeQuery(query);

      if (!result.rows.length) {
        throw new InvariantError('Album did not have likes');
      }

      await this._redisService.set(`album_likes:${albumId}`, JSON.stringify(result.rows.length));

      return { count: JSON.parse(result.rows.length), isCache: 0 };
    }
  }

  async addAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.executeQuery(query);
    if (!result.rows.length) {
      throw new InvariantError('Album cover not found');
    }
  }
}

module.exports = AlbumService;

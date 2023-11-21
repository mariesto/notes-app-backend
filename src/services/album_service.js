const { nanoid } = require('nanoid');

const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');
const DatabasePool = require('../database/database_pool');

class AlbumService {
  constructor() {
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
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const fetchedAlbum = result.rows[0];

    const querySong = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [fetchedAlbum.id],
    };

    fetchedAlbum.songs = [];
    const albumSongs = await this._pool.executeQuery(querySong);
    if (albumSongs.rowCount) {
      // eslint-disable-next-line prefer-spread
      fetchedAlbum.songs.push.apply(fetchedAlbum.songs, albumSongs.rows);
    }

    return fetchedAlbum;
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
}

module.exports = AlbumService;

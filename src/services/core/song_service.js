const { nanoid } = require('nanoid');
const {
  mapDBToModelSongs,
} = require('../../utils/util');
const NotFoundError = require('../../exceptions/NotFoundError');
const DatabasePool = require('../../database/database_pool');

class SongService {
  constructor(redisService) {
    this._redisService = redisService;
    this._pool = new DatabasePool();
  }

  async createNewSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.executeQuery(query);

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 operator performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    if (!title && !performer) {
      query.text = 'SELECT id, title, performer FROM songs';
      query.values = [];
    }
    if (title && performer) {
      query.text = query.text.replace('operator', 'AND');
    }
    if (title || performer) {
      query.text = query.text.replace('operator', 'OR');
    }

    const result = await this._pool.executeQuery(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song Not Found');
    }

    return result.rows.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING *',
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update song. Id not found');
    }
    return result.rows.map(mapDBToModelSongs)[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song failed to delete. Id not found');
    }
  }

  async getSongsByPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlist_songs ON playlist_songs."songId" = songs.id
        WHERE playlist_songs."playlistId" = $1`,
      values: [playlistId],
    };

    const result = await this._pool.executeQuery(query);
    return result.rows.map(mapDBToModelSongs);
  }

  async getSongsByAlbumId(albumId) {
    try {
      const result = await this._redisService.get(`album_songs:${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
        values: [albumId],
      };

      const result = await this._pool.executeQuery(query);
      const mappedResult = result.rows.map(mapDBToModelSongs);

      await this._redisService.set(`album_songs:${albumId}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }
}

module.exports = SongService;

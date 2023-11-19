const { nanoid } = require('nanoid');
// const { Pool } = require('pg');
const {
  mapDBToModelSongs,
} = require('../../utils/util');
const NotFoundError = require('../../exceptions/NotFoundError');
const DatabasePool = require('../../database/database_pool');

class SongService {
  constructor() {
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
    console.log(`get songs request : ${title}, ${performer}`);
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
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING *',
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
}

module.exports = SongService;

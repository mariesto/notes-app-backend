const { nanoid } = require('nanoid');
const DatabasePool = require('../database/database_pool');
const InvariantError = require('../exceptions/InvariantError');

class CollaborationService {
  constructor() {
    this._pool = new DatabasePool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.executeQuery(query);
    if (!result.rows.length) {
      throw new InvariantError('Collaborator failed to add');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.executeQuery(query);
    if (!result.rows.length) {
      throw new InvariantError('Collaborator failed to removed');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.executeQuery(query);
    if (!result.rows.length) {
      throw new InvariantError('Collaborator is not verified');
    }
  }
}

module.exports = CollaborationService;

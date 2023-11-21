const DatabasePool = require('../database/database_pool');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationService {
  constructor() {
    this._pool = new DatabasePool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.executeQuery(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token is not valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.executeQuery(query);
  }
}

module.exports = AuthenticationService;

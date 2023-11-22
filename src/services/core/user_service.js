const { nanoid } = require('nanoid');
// eslint-disable-next-line import/no-extraneous-dependencies
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');
const DatabasePool = require('../../database/database_pool');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UserService {
  constructor() {
    this._pool = new DatabasePool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new InvariantError('User failed to add');
    }
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.executeQuery(query);

    if (result.rows.length > 0) {
      throw new ClientError('Failed to add user. Username already used.');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, "fullName" FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.executeQuery(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Wrong credential');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Wrong credential');
    }
    return id;
  }
}

module.exports = UserService;
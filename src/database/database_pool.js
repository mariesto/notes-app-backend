const { Pool } = require('pg');

class DatabasePool {
  constructor() {
    this._pool = new Pool();
  }

  async executeQuery(query) {
    const { text, values } = query;
    if (values.length === 0) {
      return this._pool.query(text);
    }
    return this._pool.query(text, values);
  }
}

module.exports = DatabasePool;

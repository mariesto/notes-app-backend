const { Pool } = require('pg');

class DatabasePool {
  constructor() {
    if (!DatabasePool.instance) {
      this._pool = new Pool();
      DatabasePool.instance = this;
    }
    // eslint-disable-next-line no-constructor-return
    return DatabasePool.instance;
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

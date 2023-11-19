const { Pool } = require('pg');

class DatabasePool {
  constructor() {
    if (!DatabasePool.instance) {
      this._pool = new Pool();
    }
    DatabasePool.instance = this;
  }

  async executeQuery(query) {
    const client = await this._pool.connect();
    try {
      const { text, values } = query;
      if (values.length === 0) {
        return await client.query(text);
      }
      return await client.query(text, values);
    } finally {
      client.release();
    }
  }
}

module.exports = DatabasePool;

// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');

class RedisService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache not found');

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = RedisService;

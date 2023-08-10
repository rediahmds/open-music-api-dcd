const redis = require('redis');
const { host } = require('../../utils/config').redis;

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host,
      },
    });

    this._client.on('error', (err) => console.error('Redis server error:', err));

    this._client.connect();
  }

  async set(key, value, expirationTimeInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationTimeInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) {
      throw new Error('Cache tidak ditemukan.');
    }

    return result;
  }

  del(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;

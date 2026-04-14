const logger = require('../config/logger');

let client = null;
let cache = new Map(); // in-memory fallback

// Try to load Redis if available
try {
  const redis = require('redis');
  client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => {
    logger.warn('Redis error, using in-memory cache', err.message);
    client = null;
  });
  client.connect().catch(() => { client = null; });
} catch (e) {
  logger.info('Redis not installed, using in-memory cache');
}

const get = async (key) => {
  if (client) {
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  }
  const val = cache.get(key);
  return val ? val.value : null;
};

const set = async (key, value, ttl = 300) => {
  if (client) {
    await client.setEx(key, ttl, JSON.stringify(value));
  } else {
    cache.set(key, { value, expires: Date.now() + ttl * 1000 });
    setTimeout(() => cache.delete(key), ttl * 1000);
  }
};

const del = async (key) => {
  if (client) await client.del(key);
  else cache.delete(key);
};

module.exports = { get, set, del };

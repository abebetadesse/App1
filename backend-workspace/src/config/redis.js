import Redis from 'ioredis';

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || null,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      };

      this.client = new Redis(redisConfig);

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('🔌 Redis connection closed');
        this.isConnected = false;
      });

      // Test connection
      await this.client.ping();
      return this.client;

    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async get(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, expiry = 3600) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    try {
      const stringValue = JSON.stringify(value);
      if (expiry) {
        return await this.client.setex(key, expiry, stringValue);
      } else {
        return await this.client.set(key, stringValue);
      }
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  }

  async del(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
      throw error;
    }
  }

  async exists(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error('Redis exists error:', error);
      throw error;
    }
  }

  async quit() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

export default new;RedisService();
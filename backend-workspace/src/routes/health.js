import express from 'express';
const router = express.Router();
import { healthCheck } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { elasticsearchClient } from '../config/elasticsearch.js';

// Cache health check results for 30 seconds
let healthCache = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 30000; // 30 seconds

async function performHealthCheck() {
  const now = Date.now();
  
  // Return cached result if still valid
  if (healthCache.data && (now - healthCache.timestamp) < CACHE_DURATION) {
    return healthCache.data;
  }

  const startTime = Date.now();
  
  try {
    // Run all health checks in parallel
    const [dbHealth, redisHealth, esHealth, memoryUsage] = await Promise.all([
      healthCheck(),
      checkRedisHealth(),
      checkElasticsearchHealth(),
      getMemoryUsage()
    ]);

    const isHealthy = dbHealth.status === 'healthy' && 
                     redisHealth.status === 'healthy' && 
                     esHealth.status === 'healthy';

    const result = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      services: {
        database: dbHealth,
        redis: redisHealth,
        elasticsearch: esHealth
      },
      system: {
        memory: memoryUsage,
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // Cache the result
    healthCache = {
      data: result,
      timestamp: now
    };

    return result;
  } catch (error) {
    const errorResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: error.message,
      services: {
        database: { status: 'unknown' },
        redis: { status: 'unknown' },
        elasticsearch: { status: 'unknown' }
      }
    };

    healthCache = {
      data: errorResult,
      timestamp: now
    };

    return errorResult;
  }
}

async function checkRedisHealth() {
  try {
    const start = Date.now();
    await redisClient.ping();
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function checkElasticsearchHealth() {
  try {
    const start = Date.now();
    const health = await elasticsearchClient.cluster.health();
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      clusterStatus: health.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`
  };
}

// Health check endpoint
router.get('/', async (req, res) => {
  const healthData = await performHealthCheck();
  
  const statusCode = healthData.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json(healthData);
});

// Lightweight ping endpoint (no database queries)
router.get('/ping', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Detailed readiness probe
router.get('/ready', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    const isReady = dbHealth.status === 'healthy';
    
    res.status(isReady ? 200 : 503).json({
      ready: isReady,
      database: dbHealth.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe (simple process check)
router.get('/live', (req, res) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

export default router;
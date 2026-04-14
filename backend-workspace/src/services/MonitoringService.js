import client from 'prom-client';

class MonitoringService {
  constructor() {
    this.isInitialized = false;
    this.metrics = {};
  }

  initialize() {
    if (this.isInitialized) return;

    // Create metrics
    this.metrics = {
      httpRequestDuration: new client.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route', 'status_code'],
        buckets: [0.1, 0.5, 1, 2, 5]
      }),

      activeConnections: new client.Gauge({
        name: 'active_connections_total',
        help: 'Number of active connections'
      }),

      databaseQueries: new client.Counter({
        name: 'database_queries_total',
        help: 'Total number of database queries',
        labelNames: ['type', 'table']
      }),

      errors: new client.Counter({
        name: 'application_errors_total',
        help: 'Total number of application errors',
        labelNames: ['type', 'endpoint']
      }),

      memoryUsage: new client.Gauge({
        name: 'process_memory_usage_bytes',
        help: 'Memory usage of the process',
        labelNames: ['type']
      })
    };

    this.isInitialized = true;
    console.log('✅ Monitoring service initialized');
  }

  recordRequest(method, route, statusCode, duration) {
    if (!this.isInitialized) return;
    
    this.metrics.httpRequestDuration.observe(
      { method, route, status_code: statusCode },
      duration
    );
  }

  recordDatabaseQuery(type, table) {
    if (!this.isInitialized) return;
    
    this.metrics.databaseQueries.inc({ type, table });
  }

  recordError(type, endpoint) {
    if (!this.isInitialized) return;
    
    this.metrics.errors.inc({ type, endpoint });
  }

  updateMemoryUsage() {
    if (!this.isInitialized) return;

    const memoryUsage = process.memoryUsage();
    this.metrics.memoryUsage.set({ type: 'rss' }, memoryUsage.rss);
    this.metrics.memoryUsage.set({ type: 'heap_total' }, memoryUsage.heapTotal);
    this.metrics.memoryUsage.set({ type: 'heap_used' }, memoryUsage.heapUsed);
    this.metrics.memoryUsage.set({ type: 'external' }, memoryUsage.external);
  }

  getMetrics() {
    if (!this.isInitialized) {
      throw new Error('Monitoring service not initialized');
    }
    return client.register.metrics();
  }

  async getMetricsAsString() {
    if (!this.isInitialized) {
      return '# Monitoring service not initialized\n';
    }
    return await client.register.metrics();
  }
}

export default MonitoringService;

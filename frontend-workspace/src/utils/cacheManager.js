class CacheManager {
  constructor(ttl = 5 * 60 * 1000) { this.cache = new Map(); this.ttl = ttl; }
  set(key, data) { this.cache.set(key, { data, timestamp: Date.now() }); }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) { this.cache.delete(key); return null; }
    return entry.data;
  }
  clear() { this.cache.clear(); }
}
export const apiCache = new CacheManager();

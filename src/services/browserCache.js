class BrowserCache {
    constructor() {
      this.cache = typeof window !== 'undefined' ? new Map() : null;
      this.ttlMap = typeof window !== 'undefined' ? new Map() : null;
      
      this.ttlConfig = {
        current: 2 * 60 * 1000,     // 2 minutes
        upcoming: 5 * 60 * 1000,    // 5 minutes
        listed: 15 * 60 * 1000,     // 15 minutes
        completed: 60 * 60 * 1000,  // 1 hour
        default: 5 * 60 * 1000      // 5 minutes default
      };
    }
  
    get(key) {
      if (!this.cache) return null;
  
      if (this.cache.has(key)) {
        const expiryTime = this.ttlMap.get(key);
        if (expiryTime && expiryTime > Date.now()) {
          return this.cache.get(key);
        } else {
          this.delete(key);
        }
      }
      return null;
    }
  
    set(key, value, type = 'default') {
      if (!this.cache) return false;
  
      const ttl = this.ttlConfig[type] || this.ttlConfig.default;
      const expiryTime = Date.now() + ttl;
      
      this.cache.set(key, value);
      this.ttlMap.set(key, expiryTime);
      return true;
    }
  
    delete(key) {
      if (!this.cache) return;
      this.cache.delete(key);
      this.ttlMap.delete(key);
    }
  
    clear() {
      if (!this.cache) return;
      this.cache.clear();
      this.ttlMap.clear();
    }
  }
  
  export const browserCache = new BrowserCache();
// Simple in-memory cache with TTL support
import { useState, useEffect, useCallback, lazy } from 'react';

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttlMs = 5 * 60 * 1000) { // Default 5 minutes
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set the value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttlMs
    });

    // Set expiration timer
    if (ttlMs > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttlMs);
      this.timers.set(key, timer);
    }
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  clear() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.delete(key);
      }
    }
  }
}

// Global cache instance
const globalCache = new MemoryCache();

// Cache cleanup interval (every 5 minutes)
setInterval(() => {
  globalCache.cleanup();
}, 5 * 60 * 1000);

// React hook for caching
export const useCache = (key, fetchFunction, ttlMs = 5 * 60 * 1000, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedData = globalCache.get(key);
        if (cachedData) {
          setData(cachedData);
          return cachedData;
        }
      }

      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      
      // Cache the result
      globalCache.set(key, result, ttlMs);
      setData(result);
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, ttlMs]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
};

// API response caching wrapper
export const withCache = (apiFunction, ttlMs = 5 * 60 * 1000) => {
  return async (...args) => {
    const cacheKey = `${apiFunction.name}_${JSON.stringify(args)}`;
    
    // Try to get from cache
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch and cache
    try {
      const result = await apiFunction(...args);
      globalCache.set(cacheKey, result, ttlMs);
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  };
};

// LocalStorage cache for persistence
export const localStorageCache = {
  set(key, value, ttlMs = 24 * 60 * 60 * 1000) { // Default 24 hours
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl: ttlMs
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('LocalStorage cache set failed:', error);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.warn('LocalStorage cache get failed:', error);
      return null;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('LocalStorage cache delete failed:', error);
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('LocalStorage cache clear failed:', error);
    }
  }
};

// Debounce utility for API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for frequent updates
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image optimization utility
export const optimizeImage = (url, width = 800, quality = 80) => {
  if (!url) return '';
  
  // If it's already an optimized URL or external, return as-is
  if (url.includes('?') || url.startsWith('http')) {
    return url;
  }
  
  // For local images, you could integrate with an image optimization service
  return `${url}?w=${width}&q=${quality}`;
};

// Bundle size optimization - lazy load components
export const lazyLoad = (importFunc) => {
  return lazy(importFunc);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${name} failed after ${end - start} milliseconds`, error);
      throw error;
    }
  };
};

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection type if available
    if ('connection' in navigator) {
      setConnectionType(navigator.connection.effectiveType || 'unknown');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

export default globalCache;

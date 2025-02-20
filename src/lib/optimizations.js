// lib/optimizations.js
import { memo } from 'react';
import { browserCache } from './browserCache';

// Improved caching strategy
export const createCacheKey = (key, params = {}) => {
  return `${key}-${JSON.stringify(params)}`;
};

export const withCache = async (key, fetchFn, options = {}) => {
  const cacheKey = createCacheKey(key, options);
  const cachedData = browserCache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const data = await fetchFn();
  browserCache.set(cacheKey, data, options.type);
  return data;
};

// Memoization helper
export const memoizeComponent = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual);
};

// Data validation helper
export const validateIPOData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid IPO data structure');
  }

  const requiredArrays = ['current', 'upcoming', 'listed', 'completed'];
  requiredArrays.forEach(key => {
    if (!Array.isArray(data[key])) {
      throw new Error(`Missing or invalid ${key} array in IPO data`);
    }
  });

  return data;
};

// Debounce helper for search
export const debounceFunction = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Safe number formatting
export const formatNumber = (value, options = {}) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return options.fallback || 'N/A';
  }
  
  try {
    return new Intl.NumberFormat(options.locale || 'en-IN', {
      style: options.style || 'decimal',
      minimumFractionDigits: options.minFraction || 0,
      maximumFractionDigits: options.maxFraction || 2,
    }).format(value);
  } catch (error) {
    console.error('Number formatting error:', error);
    return options.fallback || value.toString();
  }
};
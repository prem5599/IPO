// services/ipoCache.js
import { cache } from 'react';
import { fetchIPOData } from './ipoService';

export const getCachedIPOData = cache(async () => {
  try {
    const data = await fetchIPOData();
    return data;
  } catch (error) {
    console.error('Failed to fetch IPO data:', error);
    return {
      current: [],
      upcoming: [],
      listed: [],
      completed: []
    };
  }
});
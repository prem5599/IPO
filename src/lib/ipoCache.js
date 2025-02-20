import { cache } from 'react';
import { fetchIPOData } from '../services/ipoService';

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
}, {
  revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600,
  tags: ['ipo-data']
});
import { cache } from 'react';
import { fetchIPOData } from '../services/ipoService';

// Cache for all IPO data
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
  revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600, // 1 hour in production
  tags: ['ipo-data']
});

// Cache for individual IPO details
export const getCachedIPODetails = cache(async (symbol) => {
  try {
    const allData = await getCachedIPOData();
    const categories = ['current', 'upcoming', 'listed', 'completed'];
    
    for (const category of categories) {
      const ipo = allData[category]?.find(item => item.symbol === symbol);
      if (ipo) return ipo;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch IPO details for ${symbol}:`, error);
    return null;
  }
}, {
  revalidate: process.env.NODE_ENV === 'development' ? 0 : 1800, // 30 minutes in production
  tags: ['ipo-data']
});

// Cache for market statistics
export const getCachedMarketStats = cache(async () => {
  try {
    const data = await getCachedIPOData();
    return {
      totalIPOs: Object.values(data).reduce((total, arr) => 
        total + (Array.isArray(arr) ? arr.length : 0), 0),
      activeIPOs: Array.isArray(data.current) ? data.current.length : 0,
      upcomingIPOs: Array.isArray(data.upcoming) ? data.upcoming.length : 0,
      listedIPOs: Array.isArray(data.listed) ? data.listed.length : 0
    };
  } catch (error) {
    console.error('Failed to fetch market stats:', error);
    return {
      totalIPOs: 0,
      activeIPOs: 0,
      upcomingIPOs: 0,
      listedIPOs: 0
    };
  }
}, {
  revalidate: process.env.NODE_ENV === 'development' ? 0 : 600, // 10 minutes in production
  tags: ['ipo-data']
});
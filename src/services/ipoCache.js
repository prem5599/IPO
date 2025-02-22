// services/ipoCache.js
import { cache } from 'react';
import { fetchIPOData } from './ipoService';

// Built-in validation function
const validateIPOData = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const requiredKeys = ['current', 'upcoming', 'listed', 'completed'];
  return requiredKeys.every(key => 
    Array.isArray(data[key]) || data[key] === undefined
  );
};

// Cache for all IPO data
export const getCachedIPOData = cache(async () => {
  try {
    const data = await fetchIPOData();
   
    // Validate data structure
    if (!validateIPOData(data)) {
      throw new Error('Invalid IPO data structure');
    }

    // Ensure all arrays exist and are valid
    const sanitizedData = {
      current: Array.isArray(data.current) ? data.current : [],
      upcoming: Array.isArray(data.upcoming) ? data.upcoming : [],
      listed: Array.isArray(data.listed) ? data.listed : [],
      completed: Array.isArray(data.completed) ? data.completed : []
    };

    // Process dates and numbers
    Object.keys(sanitizedData).forEach(category => {
      sanitizedData[category] = sanitizedData[category].map(ipo => ({
        ...ipo,
        bidding_start_date: ipo.bidding_start_date ? new Date(ipo.bidding_start_date) : null,
        bidding_end_date: ipo.bidding_end_date ? new Date(ipo.bidding_end_date) : null,
        listing_date: ipo.listing_date ? new Date(ipo.listing_date) : null,
        min_price: typeof ipo.min_price === 'number' ? ipo.min_price : null,
        max_price: typeof ipo.max_price === 'number' ? ipo.max_price : null,
      }));
    });

    return sanitizedData;
  } catch (error) {
    console.error('Failed to fetch IPO data:', error);
    // Return empty but valid data structure
    return {
      current: [],
      upcoming: [],
      listed: [],
      completed: []
    };
  }
}, {
  tags: ['ipo-data'],
  revalidate: 300 // 5 minutes
});

// Cache for individual IPO details
export const getCachedIPODetails = cache(async (symbol) => {
  try {
    if (!symbol) throw new Error('Symbol is required');
   
    const allData = await getCachedIPOData();
    const categories = ['current', 'upcoming', 'listed', 'completed'];
   
    for (const category of categories) {
      const ipo = allData[category]?.find(item =>
        item.symbol?.toLowerCase() === symbol.toLowerCase()
      );
      if (ipo) return ipo;
    }
   
    return null;
  } catch (error) {
    console.error(`Failed to fetch IPO details for ${symbol}:`, error);
    return null;
  }
}, {
  tags: ['ipo-details'],
  revalidate: 300 // 5 minutes
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
  tags: ['market-stats'],
  revalidate: 600 // 10 minutes
});
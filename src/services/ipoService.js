import axios from 'axios';

export async function fetchIPOData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const options = {
      method: 'GET',
      url: apiBaseUrl,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.request(options);
    
    return {
      current: data.active || [],
      upcoming: data.upcoming || [],
      listed: data.listed || [],
      completed: data.closed || []
    };
  } catch (error) {
    console.error('Fetch IPO data error:', error);
    return {
      current: [],
      upcoming: [],
      listed: [],
      completed: []
    };
  }
}

export async function fetchIPODetails(symbol) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const options = {
      method: 'GET',
      url: `${apiBaseUrl}/${symbol}`,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error(`Error fetching IPO details for ${symbol}:`, error);
    return null;
  }
}

export async function fetchIPOSubscriptionData(symbol) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const options = {
      method: 'GET',
      url: `${apiBaseUrl}/${symbol}/subscription`,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error(`Error fetching subscription data for ${symbol}:`, error);
    return null;
  }
}
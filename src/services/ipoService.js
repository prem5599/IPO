import { fetchMockIPOData } from './mockIPOService';

export async function fetchIPOData() {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    return fetchMockIPOData();
  }

  // In production, make actual API call
  try {
    const response = await fetch('YOUR_API_ENDPOINT');
    return response.json();
  } catch (error) {
    console.error('API fetch failed', error);
    return fetchMockIPOData(); // Fallback to mock data
  }
}
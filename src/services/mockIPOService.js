import { mockIPOData } from './mockData';

export async function fetchMockIPOData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Map the API data to our expected structure
  return {
    current: mockIPOData.active || [],
    upcoming: mockIPOData.upcoming || [],
    listed: mockIPOData.listed || [],
    completed: mockIPOData.closed || []
  };
}
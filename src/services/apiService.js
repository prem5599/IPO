// src/services/apiService.js
import { errorHandler, responseHandler, validateUtils } from '../utils/errorUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

export const apiService = {
  async get(endpoint, options = {}) {
    try {
      const response = await responseHandler.handleFetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        next: { revalidate: options.revalidate || 300 }
      });

      if (endpoint.includes('/ipos') && !validateUtils.isValidIPOData(response)) {
        throw new Error('Invalid IPO data structure received from server');
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  async post(endpoint, data, options = {}) {
    try {
      return await responseHandler.handleFetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { ...defaultHeaders, ...options.headers },
        body: JSON.stringify(data)
      });
    } catch (error) {
      throw error;
    }
  }
};
// src/utils/errorUtils.js
export const errorHandler = {
    // General error types
    errorTypes: {
      API_ERROR: 'API_ERROR',
      NETWORK_ERROR: 'NETWORK_ERROR',
      DATA_ERROR: 'DATA_ERROR',
      AUTH_ERROR: 'AUTH_ERROR',
      VALIDATION_ERROR: 'VALIDATION_ERROR'
    },
  
    // Check error types
    isNetworkError(error) {
      return !window.navigator.onLine || error.message === 'Failed to fetch';
    },
  
    isApiError(error) {
      return error.message.includes('API call failed');
    },
  
    getErrorMessage(error) {
      if (this.isNetworkError(error)) {
        return 'Please check your internet connection and try again.';
      }
      
      if (this.isApiError(error)) {
        return 'Unable to reach the server. Please try again later.';
      }
      
      return error.message || 'An unexpected error occurred.';
    },
  
    logError(error, context = '') {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      };
  
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error:', errorInfo);
      }
  
      // Here you could add external error logging service
      try {
        this.sendErrorToServer(errorInfo);
      } catch (e) {
        console.error('Failed to send error to server:', e);
      }
    },
  
    async sendErrorToServer(errorInfo) {
      try {
        await fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorInfo)
        });
      } catch (error) {
        console.error('Failed to send error to logging service:', error);
      }
    },
  
    // Handle API errors
    handleApiError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return 'Invalid request. Please check your data.';
          case 401:
            return 'Please login to continue.';
          case 403:
            return 'You do not have permission to perform this action.';
          case 404:
            return 'The requested resource was not found.';
          case 429:
            return 'Too many requests. Please try again later.';
          case 500:
            return 'Server error. Please try again later.';
          default:
            return 'An unexpected error occurred.';
        }
      }
      return this.getErrorMessage(error);
    }
  };
  
  // Create a notification utility to show errors to users
  export const notifyUtils = {
    showToast(message, type = 'error') {
      // You can integrate this with your preferred toast library
      // For now, we'll use a simple alert
      if (process.env.NODE_ENV === 'development') {
        console.log(`${type.toUpperCase()}: ${message}`);
      }
      alert(message);
    },
  
    showError(error, context = '') {
      const message = errorHandler.getErrorMessage(error);
      this.showToast(message, 'error');
      errorHandler.logError(error, context);
    },
  
    showSuccess(message) {
      this.showToast(message, 'success');
    },
  
    showWarning(message) {
      this.showToast(message, 'warning');
    }
  };
  
  // API response handler
  export const responseHandler = {
    async handleResponse(response) {
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText);
        error.response = response;
        throw error;
      }
      
      try {
        return await response.json();
      } catch (error) {
        throw new Error('Invalid JSON response from server');
      }
    },
  
    async handleFetch(url, options = {}) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
        return await this.handleResponse(response);
      } catch (error) {
        errorHandler.logError(error, `API call to ${url}`);
        throw error;
      }
    }
  };
  
  // Data validation utility
  export const validateUtils = {
    isValidIPOData(data) {
      if (!data || typeof data !== 'object') {
        return false;
      }
  
      const requiredKeys = ['current', 'upcoming', 'listed', 'completed'];
      return requiredKeys.every(key => Array.isArray(data[key]));
    },
  
    isValidIPO(ipo) {
      if (!ipo || typeof ipo !== 'object') {
        return false;
      }
  
      const requiredFields = ['name', 'status'];
      return requiredFields.every(field => ipo[field]);
    }
  };
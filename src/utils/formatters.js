// src/utils/formatters.js
export const formatters = {
    currency: (amount, defaultValue = 'N/A') => {
      if (!amount && amount !== 0) return defaultValue;
      try {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(amount);
      } catch (error) {
        console.error('Currency formatting error:', error);
        return defaultValue;
      }
    },
  
    percentage: (value, defaultValue = 'N/A') => {
      if (!value && value !== 0) return defaultValue;
      try {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(numValue) ? defaultValue : `${numValue.toFixed(2)}%`;
      } catch (error) {
        console.error('Percentage formatting error:', error);
        return defaultValue;
      }
    },
  
    date: (dateString, defaultValue = 'TBA') => {
      if (!dateString) return defaultValue;
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return defaultValue;
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/');
      } catch (error) {
        console.error('Date formatting error:', error);
        return defaultValue;
      }
    }
  };
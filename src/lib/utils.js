// URL slug creation
export function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/\s+/g, '-');
}

// Format currency values
export function formatCurrency(value) {
  if (!value && value !== 0) return 'TBA';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

// Format dates
export function formatDate(dateString, format = 'short') {
  if (!dateString) return 'TBA';
  
  try {
    const date = new Date(dateString);
    
    if (format === 'short') {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    }
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

// Format percentage values
export function formatPercentage(value, includeSign = true) {
  if (!value && value !== 0) return 'N/A';
  const formatted = Number(value).toFixed(2);
  return includeSign ? `${formatted}%` : formatted;
}

// Get IPO status text and colors
export function getIPOStatusConfig(status) {
  const configs = {
    active: {
      label: 'Active',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    upcoming: {
      label: 'Upcoming',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    listed: {
      label: 'Listed',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200'
    },
    completed: {
      label: 'Completed',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200'
    }
  };

  return configs[status] || configs.completed;
}

// Helper to extract meta description from IPO data
export function generateIPOMetaDescription(ipo) {
  const priceRange = ipo.min_price && ipo.max_price
    ? `${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}`
    : 'Price to be announced';

  const dates = ipo.bidding_start_date
    ? `${formatDate(ipo.bidding_start_date)} to ${formatDate(ipo.bidding_end_date) || 'TBA'}`
    : 'Dates to be announced';

  return `${ipo.name} IPO opens ${dates}. Price band: ${priceRange}. ${
    ipo.is_sme ? 'SME IPO.' : ''
  } Check subscription status, lot size, and apply online.`;
}

// Get canonical URL
export function getCanonicalUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  return `${baseUrl}${path}`;
}
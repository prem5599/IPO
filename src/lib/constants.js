export const IPO_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  LISTED: 'listed',
  COMPLETED: 'completed'
};

export const TAB_CONFIG = {
  current: {
    title: 'Active IPOs',
    heading: 'Currently Open IPOs',
    status: 'Open Now',
    color: 'success'
  },
  upcoming: {
    title: 'Upcoming',
    heading: 'Upcoming IPO Offerings',
    status: 'Upcoming',
    color: 'warning'
  },
  listed: {
    title: 'Listed',
    heading: 'Listed IPOs',
    status: 'Listed',
    color: 'info'
  },
  completed: {
    title: 'Completed',
    heading: 'Recently Completed IPOs',
    status: 'Completed',
    color: 'secondary'
  }
};

export const TABS = [
  { key: 'current', label: 'Active IPOs' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'listed', label: 'Listed' },
  { key: 'completed', label: 'Completed' }
];

export const SEO_CONFIG = {
  default: {
    title: 'IPO Page - Indian IPO Platform',
    description: 'Track and analyze Indian Initial Public Offerings (IPOs). Get real-time updates, detailed analysis, and apply for IPOs online.',
    keywords: 'IPO, stock market, investment, share market, BSE, NSE, initial public offering, Indian stock market'
  },
  ipo: {
    titleTemplate: '%s IPO Details | IPO Page',
    descriptionTemplate: '%s IPO - Get complete details including price band, issue date, subscription status, and more. Apply online through our platform.'
  }
};

export const CACHE_KEYS = {
  IPO_DATA: 'ipo_data',
  IPO_DETAILS: 'ipo_details_',
  MARKET_STATS: 'market_stats'
};

export const NOTIFICATION_TYPES = {
  IPO_OPEN: 'ipo_open',
  PRICE_CHANGE: 'price_change',
  SUBSCRIPTION_UPDATE: 'subscription_update',
  LISTING_DATE: 'listing_date'
};
'use client';

import { Clock } from 'lucide-react';

const IPOStatusBanner = ({ biddingDates }) => {
  const calculateStatus = () => {
    // If no dates are provided
    if (!biddingDates?.start || !biddingDates?.end) {
      return {
        message: 'Dates to be announced',
        bgColor: 'bg-secondary-subtle'
      };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Date parsing utility
    const parseDate = (dateStr) => {
      if (dateStr instanceof Date) return dateStr;
      
      const parsedDate = new Date(dateStr);
      parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    };

    const startDate = parseDate(biddingDates.start);
    const endDate = parseDate(biddingDates.end);

    // Calculate time differences in days
    const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
    const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    // IPO hasn't started yet
    if (now < startDate) {
      return {
        message: `IPO Opens in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`,
        bgColor: 'bg-info-subtle'
      };
    }
    
    // IPO is currently open
    if (now >= startDate && now <= endDate) {
      return {
        message: `${daysUntilEnd} day${daysUntilEnd !== 1 ? 's' : ''} left to apply`,
        bgColor: 'bg-success-subtle'
      };
    }
    
    // IPO has ended
    return {
      message: 'IPO Bidding Closed',
      bgColor: 'bg-secondary-subtle'
    };
  };

  const status = calculateStatus();

  return (
    <div className={`d-flex align-items-center mb-4 ${status.bgColor} w-full p-2 rounded`}>
      <Clock size={16} className="me-2 text-muted" />
      <span className="text-muted">{status.message}</span>
    </div>
  );
};

export default IPOStatusBanner;

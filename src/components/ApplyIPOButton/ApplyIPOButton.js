'use client';

import { memo, useState } from 'react';
import { Check, AlertCircle, Bell, BellOff } from 'lucide-react';
import { useIPONotifications } from '../../hooks/useIPONotifications';

const ApplyIPOButton = memo(({ status: providedStatus, additionalText, ipo }) => {
  const [showError, setShowError] = useState(false);
  const { isSubscribed, isLoading, subscribe, unsubscribe } = useIPONotifications(ipo?.symbol);

  const determineStatus = () => {
    if (providedStatus) return providedStatus;
    if (!ipo) return 'default';

    const today = new Date();
    const startDate = ipo.bidding_start_date ? new Date(ipo.bidding_start_date) : null;
    const endDate = ipo.bidding_end_date ? new Date(ipo.bidding_end_date) : null;
    const listingDate = ipo.listing_date ? new Date(ipo.listing_date) : null;

    if (listingDate && today >= listingDate) return 'listed';
    
    if (startDate && endDate) {
      if (today >= startDate && today <= endDate) return 'current';
      if (today < startDate) return 'upcoming';
      if (today > endDate) return 'completed';
    }

    if (ipo.listing_gains !== null && ipo.listing_gains !== undefined) {
      return 'listed';
    }

    return 'upcoming';
  };

  const status = determineStatus();

  const buttonConfig = {
    current: { 
      text: 'Apply IPO', 
      className: 'bg-blue-500 text-white hover:bg-blue-600' 
    },
    upcoming: { 
      text: isSubscribed ? 'Notifications On' : 'Notify Me', 
      className: isSubscribed 
        ? 'bg-green-500 text-white hover:bg-green-600' 
        : 'border border-blue-500 text-blue-500 hover:bg-blue-50' 
    },
    listed: { 
      text: 'View Details', 
      className: 'bg-gray-500 text-white hover:bg-gray-600' 
    },
    completed: { 
      text: 'Closed', 
      className: 'bg-gray-400 text-white cursor-not-allowed' 
    },
    default: { 
      text: 'Apply IPO', 
      className: 'bg-blue-500 text-white hover:bg-blue-600' 
    }
  };

  const { text, className } = buttonConfig[status] || buttonConfig.default;
  const isDisabled = status === 'listed' || status === 'completed' || isLoading;

  const requirements = [
    { id: 1, text: 'UPI ID Required' },
    { id: 2, text: additionalText || 'Check eligibility' }
  ];

  const handleNotifyClick = async () => {
    if (status !== 'upcoming') return;

    try {
      setShowError(false);
      
      if (isSubscribed) {
        await unsubscribe(ipo.symbol);
      } else {
        await subscribe(ipo);
      }
    } catch (error) {
      console.error('Error handling notification toggle:', error);
      setShowError(true);
    }
  };

  return (
    <div 
      className="bg-white border rounded-lg shadow-sm p-4 w-full max-w-xs" 
      role="region" 
      aria-label="IPO application"
    >
      <button 
        className={`w-full py-2 rounded mb-3 transition-colors ${className} flex items-center justify-center gap-2`}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={handleNotifyClick}
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>Setting up...</span>
          </>
        ) : (
          <>
            {status === 'upcoming' && (
              isSubscribed ? <Bell size={16} /> : <BellOff size={16} />
            )}
            {text}
          </>
        )}
      </button>

      {showError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-red-600 text-sm">
          Please enable notifications in your browser settings to receive alerts.
        </div>
      )}
      
      <div className="space-y-2">
        {requirements.map(({ id, text }) => (
          <div key={id} className="flex items-center space-x-2">
            {status === 'listed' ? (
              <AlertCircle 
                size={16} 
                className="text-gray-400 flex-shrink-0" 
                aria-hidden="true" 
              />
            ) : (
              <Check 
                size={16} 
                className="text-green-500 flex-shrink-0" 
                aria-hidden="true" 
              />
            )}
            <span className="text-gray-600 text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

ApplyIPOButton.displayName = 'ApplyIPOButton';

export default ApplyIPOButton;
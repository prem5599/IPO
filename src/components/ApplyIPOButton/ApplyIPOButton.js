// src/components/ApplyIPOButton/ApplyIPOButton.js
'use client';

import { memo } from 'react';
import { Check, AlertCircle } from 'lucide-react';

const ApplyIPOButton = memo(({ status, additionalText }) => {
  const buttonConfig = {
    current: { text: 'Apply IPO', className: 'bg-blue-500 text-white hover:bg-blue-600' },
    upcoming: { text: 'Notify Me', className: 'border border-blue-500 text-blue-500 hover:bg-blue-50' },
    listed: { text: 'View Details', className: 'bg-gray-500 text-white hover:bg-gray-600' },
    default: { text: 'Apply IPO', className: 'bg-blue-500 text-white hover:bg-blue-600' }
  };

  const { text, className } = buttonConfig[status] || buttonConfig.default;
  const isDisabled = status === 'listed' || status === 'completed';

  const requirements = [
    { id: 1, text: 'UPI ID Required' },
    { id: 2, text: additionalText || 'Check eligibility' }
  ];

  return (
    <div 
      className="bg-white border rounded-lg shadow-sm p-4 w-full max-w-xs" 
      role="region" 
      aria-label="IPO application"
    >
      <button 
        className={`w-full py-2 rounded mb-3 transition-colors ${className}`}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {text}
      </button>
      
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
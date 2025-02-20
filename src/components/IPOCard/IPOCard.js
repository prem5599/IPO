'use client';

import { useMemo } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { createSlug } from '../../lib/utils';

const formatCurrency = (amount, defaultValue = 'N/A') => {
  if (!amount && amount !== 0) return defaultValue;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value, defaultValue = 'N/A') => {
  if (!value && value !== 0) return defaultValue;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? defaultValue : `${numValue.toFixed(2)}%`;
};

const STATUS_CONFIG = {
  current: {
    label: 'Open Now',
    color: 'bg-green-100 text-green-800',
    buttonText: 'Apply Now',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  upcoming: {
    label: 'Upcoming',
    color: 'bg-yellow-100 text-yellow-800',
    buttonText: 'Notify Me',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  listed: {
    label: 'Listed',
    color: 'bg-blue-100 text-blue-800',
    buttonText: 'View Details',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    buttonText: 'View Details',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  },
};

export default function IPOCard({ ipo, activeTab, isLoading = false }) {
  const statusInfo = useMemo(() => {
    const status = STATUS_CONFIG[activeTab] || STATUS_CONFIG.completed;
    return {
      label: status.label,
      color: status.color,
      buttonText: status.buttonText,
      buttonColor: status.buttonColor,
    };
  }, [activeTab]);

  const renderDetails = useMemo(() => {
    if (!ipo) return null;

    const gridCols = activeTab === 'listed' 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' 
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    return (
      <div className={`grid ${gridCols} gap-3 mt-3`}>
        {activeTab === 'listed' ? (
          <>
            <DetailBox label="Listing Date" value={ipo.listing_date} />
            <DetailBox 
              label="Price Band" 
              value={`${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}`} 
            />
            <DetailBox 
              label="Issue Price" 
              value={formatCurrency(ipo.issue_price)} 
            />
            <DetailBox 
              label="Listing Price" 
              value={formatCurrency(ipo.listing_price)} 
            />
            <DetailBox 
              label="Listing Gains" 
              value={formatPercentage(ipo.listing_gains)}
              isGain={true}
              gainValue={ipo.listing_gains}
            />
          </>
        ) : (
          <>
            <DetailBox 
              label="Price Band" 
              value={`${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}`} 
            />
            <DetailBox 
              label="Lot Size" 
              value={ipo.lot_size ? `${ipo.lot_size.toLocaleString()} shares` : 'N/A'} 
            />
            <DetailBox 
              label="Issue Size" 
              value={formatCurrency(ipo.issue_size || "NA")} 
            />
            {ipo.listing_date && (
              <DetailBox 
                label="Listing Date" 
                value={ipo.listing_date} 
              />
            )}
          </>
        )}
      </div>
    );
  }, [ipo, activeTab]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!ipo) {
    console.warn('IPOCard received invalid data');
    return null;
  }

  return (
    <div className="relative pb-16 sm:pb-0">
      <Link 
        href={`/ipo/${createSlug(ipo.name)}`}
        className="block bg-white border rounded-lg mb-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
      >
        <div className="p-3 sm:p-4">
          <CardHeader ipo={ipo} statusInfo={statusInfo} />
          <BiddingDates ipo={ipo} />
          {renderDetails}
        </div>
      </Link>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 sm:hidden z-50">
        <button 
          className={`w-full py-3 px-4 rounded-lg text-white font-medium 
            ${statusInfo.buttonColor} 
            flex items-center justify-center gap-2 shadow-lg`}
          onClick={(e) => {
            e.preventDefault();
            // Handle button click action here
          }}
        >
          {statusInfo.buttonText}
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}

const DetailBox = ({ label, value, isGain, gainValue }) => {
  const gainClass = isGain && gainValue != null
    ? gainValue > 0 
      ? 'text-green-500' 
      : 'text-red-500'
    : '';

  return (
    <div className="p-2 bg-gray-50 rounded">
      <div className="text-gray-600 text-sm mb-1">{label}</div>
      <div className={`font-semibold ${gainClass}`}>{value || 'N/A'}</div>
    </div>
  );
};

const CardHeader = ({ ipo, statusInfo }) => (
  <div className="mb-3">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <h2 className="text-lg font-bold flex flex-wrap items-center gap-2">
        {ipo.name || ipo.company_name}
        {ipo.symbol && (
          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {ipo.symbol}
          </span>
        )}
      </h2>
      <div className="hidden sm:flex items-center">
        <span className="text-blue-400 group-hover:text-blue-600 text-sm font-medium 
          inline-flex items-center gap-1 transition-colors">
          View Details
          <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">→</span>
        </span>
      </div>
    </div>
    <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
    {ipo.additional_text && (
      <p className="text-gray-500 text-sm mt-1 break-words">{ipo.additional_text}</p>
    )}
  </div>
);

const BiddingDates = ({ ipo }) => (
  <div className="flex flex-wrap items-center text-gray-500 mb-3">
    <Clock className="mr-2" size={16} />
    <span className="text-sm">
      <span className="inline-block">Opens: {ipo.bidding_start_date || 'TBA'}</span>
      <span className="mx-2">|</span>
      <span className="inline-block">Closes: {ipo.bidding_end_date || 'TBA'}</span>
    </span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="border rounded-lg shadow-sm animate-pulse p-4">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="h-16 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);
'use client';

import { memo } from 'react';
import { Clock, Download } from 'lucide-react';

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'Coming soon';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Coming soon';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/');
};

export const IPOContent = memo(({ ipo }) => {
  const tabs = ['Overview'];

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Status Banner */}
      <div className="bg-green-50 px-4 py-2 rounded-lg flex flex-wrap sm:flex-nowrap justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
          <Clock className="text-green-600" size={16} />
          <span className="text-green-700 text-sm">{ipo.additional_text || 'IPO Status'}</span>
        </div>
        {ipo.status === 'upcoming' && (
          <button className="text-green-700 hover:text-green-800 font-medium text-sm">
            Set Reminder
          </button>
        )}
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
          <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
            <h1 className="text-xl sm:text-2xl font-bold">{ipo.name}</h1>
            <StatusLabel status={ipo.status} />
          </div>
        </div>

        {ipo.is_sme && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
            SME IPO
          </span>
        )}
        
        <div className="flex justify-start gap-3">
          <span className="text-gray-600 text-sm">
            Symbol: {ipo.symbol || 'Coming soon'}
          </span>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KeyStatistic 
          label="IPO Date"
          value={formatDate(ipo.bidding_start_date)}
        />
        <KeyStatistic 
          label="Listing Date"
          value={formatDate(ipo.listing_date)}
        />
        <KeyStatistic 
          label="Price Range"
          value={ipo.min_price || ipo.max_price ? 
            `${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}` : 
            'Coming soon'}
        />
      </div>

      {/* IPO Details */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">IPO Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <DetailItem 
              label="Issue Period"
              value={ipo.bidding_start_date ? 
                `${formatDate(ipo.bidding_start_date)} - ${formatDate(ipo.bidding_end_date) || 'Coming soon'}` : 
                'Coming soon'}
            />
            <DetailItem 
              label="Lot Size"
              value={ipo.lot_size ? `${ipo.lot_size.toLocaleString()} Shares` : 'Coming soon'}
            />
            <DetailItem 
              label="Listing Gains"
              value={ipo.listing_gains ? `${ipo.listing_gains.toFixed(2)}%` : 'Coming soon'}
              className={ipo.listing_gains > 0 ? 'text-green-600' : 
                        ipo.listing_gains < 0 ? 'text-red-600' : ''}
            />
          </div>
          <div>
            <DetailItem 
              label="Issue Price"
              value={formatCurrency(ipo.issue_price)}
            />
            <DetailItem 
              label="Listing Price"
              value={formatCurrency(ipo.listing_price)}
            />
            <div>
              <div className="text-gray-600 text-sm mb-1">Documents</div>
              {ipo.document_url ? (
                <a 
                  href={ipo.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  View Prospectus
                </a>
              ) : (
                <span className="font-medium">Coming soon</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const KeyStatistic = memo(({ label, value }) => (
  <div className="border rounded-lg p-4">
    <div className="text-gray-600 mb-1 text-sm">{label}</div>
    <div className="font-bold text-lg">{value}</div>
  </div>
));

const DetailItem = memo(({ label, value, className = '' }) => (
  <div className="mb-4">
    <div className="text-gray-600 text-sm mb-1">{label}</div>
    <div className={`font-medium ${className}`}>{value}</div>
  </div>
));

const StatusLabel = memo(({ status }) => (
  <div className="flex items-center gap-2 sm:ml-auto">
    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
      status === 'active' ? 'bg-green-100 text-green-800' :
      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
      status === 'listed' ? 'bg-purple-100 text-purple-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status === 'active' ? 'Active' :
       status === 'upcoming' ? 'Upcoming' :
       status === 'listed' ? 'Listed' : 'Completed'}
    </span>
  </div>
));

IPOContent.displayName = 'IPOContent';
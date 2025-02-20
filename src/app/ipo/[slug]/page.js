import { getCachedIPOData } from '../../../services/ipoCache';
import { createSlug } from '../../../lib/utils';
import { Clock, Download, AlertCircle } from 'lucide-react';
import ApplyIPOButton from '../../../components/ApplyIPOButton/ApplyIPOButton';
import BrokerCard from '../../../components/BrokerCard/BrokerCard';

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'Data will update soon';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default async function IPODetailPage({ params }) {
  try {
    const { slug } = params;
    const ipoData = await getCachedIPOData();
    
    const allIPOs = [
      ...(ipoData?.current || []),
      ...(ipoData?.upcoming || []),
      ...(ipoData?.listed || []),
      ...(ipoData?.completed || [])
    ];
    
    const ipo = allIPOs.find(item => createSlug(item?.name || '') === slug);

    if (!ipo) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-700 mb-4">IPO Not Found</h1>
            <p className="text-red-600">The IPO you're looking for could not be found.</p>
          </div>
        </div>
      );
    }

    const tabs = ['Overview'];

    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                  <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
                    <h1 className="text-xl sm:text-2xl font-bold">{ipo.name}</h1>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        ipo.status === 'active' ? 'bg-green-100 text-green-800' :
                        ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        ipo.status === 'listed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ipo.status === 'active' ? 'Active' :
                         ipo.status === 'upcoming' ? 'Upcoming' :
                         ipo.status === 'listed' ? 'Listed' : 'Completed'}
                      </span>
                    </div>
                  </div>
                </div>

                {ipo.is_sme && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    SME IPO
                  </span>
                )}
                
                <div className="flex justify-start gap-3">
                  <span className="text-gray-600 text-sm">
                    Symbol: {ipo.symbol || 'Data will update soon'}
                  </span>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="border rounded-lg p-4">
                  <div className="text-gray-600 mb-1 text-sm">Listing Gains</div>
                  <div className={`font-bold text-lg ${
                    ipo.listing_gains > 0 ? 'text-green-600' : 
                    ipo.listing_gains < 0 ? 'text-red-600' : ''
                  }`}>
                    {ipo.listing_gains ? `${ipo.listing_gains.toFixed(2)}%` : 'Data will update soon'}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-gray-600 mb-1 text-sm">Price Band</div>
                  <div className="font-bold text-lg">
                    {ipo.min_price || ipo.max_price ? 
                      `${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}` : 
                      'Data will update soon'}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-gray-600 mb-1 text-sm">Lot Size</div>
                  <div className="font-bold text-lg">
                    {ipo.lot_size ? `${ipo.lot_size.toLocaleString()} Shares` : 'Data will update soon'}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <nav className="flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className="pb-3 px-1 text-sm border-b-2 border-blue-500 text-blue-600 font-medium"
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* IPO Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">IPO Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-600 text-sm mb-1">Issue Period</div>
                      <div className="font-medium">
                        {ipo.bidding_start_date ? 
                          `${ipo.bidding_start_date} - ${ipo.bidding_end_date || 'TBA'}` : 
                          'Data will update soon'}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-600 text-sm mb-1">Listing Date</div>
                      <div className="font-medium">
                        {ipo.listing_date || "Data will update soon"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm mb-1">Listing Price</div>
                      <div className="font-medium">
                        {formatCurrency(ipo.listing_price)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-600 text-sm mb-1">Issue Price</div>
                      <div className="font-medium">
                        {formatCurrency(ipo.issue_price)}
                      </div>
                    </div>
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
                        <span className="font-medium">Data will update soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ApplyIPOButton status={ipo.status} additionalText={ipo.additional_text} />
            <BrokerCard />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in IPODetailPage:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
          <p className="text-red-600">We encountered an error while loading the IPO details. Please try again later.</p>
        </div>
      </div>
    );
  }
}
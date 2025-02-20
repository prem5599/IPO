'use client';

import { useState, useEffect } from 'react';
import { TABS } from '../../lib/constants';
import IPOCard from '../IPOCard/IPOCard';
import TabSection from '../TabSection/TabSection';
import MarketStats from '../MarketStats/MarketStats';
import BrokerCard from '../BrokerCard/BrokerCard';

export default function IPOPlatform({ initialData }) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const ITEMS_PER_PAGE = 5;
  
  const [ipoData, setIpoData] = useState({
    current: [],
    upcoming: [],
    listed: [],
    completed: []
  });

  useEffect(() => {
    if (initialData) {
      setIpoData(initialData);
    }
    setIsMounted(true);
  }, [initialData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return ipoData[activeTab]?.slice(startIndex, endIndex) || [];
  };

  const totalPages = Math.ceil((ipoData[activeTab]?.length || 0) / ITEMS_PER_PAGE);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-5">
      {/* Mobile Stats Toggle Button */}
      <button 
        className="md:hidden w-full mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg"
        onClick={() => setShowMobileStats(!showMobileStats)}
      >
        {showMobileStats ? 'Hide Stats & Broker Info' : 'Show Stats & Broker Info'}
      </button>

      {/* Mobile Stats Section */}
      <div className={`md:hidden ${showMobileStats ? 'block' : 'hidden'} mb-6`}>
        <div className="space-y-4">
          <BrokerCard />
          <MarketStats ipoData={ipoData} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-6">
        {/* Main Content */}
        <div className="w-full lg:w-[800px] bg-white p-4 md:p-8 rounded-lg border border-gray-300">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">Latest IPO Offerings</h1>
          
          <TabSection 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ipoData={ipoData}
            TABS={TABS}
          />

          {getCurrentPageData().length > 0 ? (
            <>
              <div className="space-y-4">
                {getCurrentPageData().map((ipo) => (
                  <IPOCard 
                    key={ipo.symbol} 
                    ipo={{
                      ...ipo,
                      company_name: ipo.name,
                      price_band: {
                        min: ipo.min_price,
                        max: ipo.max_price
                      },
                      bidding_dates: {
                        start: ipo.bidding_start_date,
                        end: ipo.bidding_end_date
                      }
                    }} 
                    activeTab={activeTab} 
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  
                  <div className="flex flex-wrap gap-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-8 h-8 rounded ${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No IPOs found in the {activeTab} category
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block lg:sticky lg:top-20 h-fit">
          <div className="flex flex-col gap-4">
            <div className="w-full lg:w-[300px]">
              <BrokerCard />
            </div>
            <div className="w-full lg:w-[322px]">
              <MarketStats ipoData={ipoData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
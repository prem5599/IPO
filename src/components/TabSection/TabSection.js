'use client';

import { memo } from 'react';

const TabSection = memo(({ 
  activeTab, 
  setActiveTab, 
  ipoData, 
  TABS 
}) => {
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const renderTabButton = (tab, isMobile = false) => {
    const isActive = activeTab === tab.key;
    const count = ipoData[tab.key]?.length || 0;
    
    const baseClasses = isMobile
      ? `w-full text-start py-2 px-3 rounded ${
          isActive 
            ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500' 
            : 'text-gray-600 hover:bg-gray-100'
        }`
      : `px-4 py-2 ${
          isActive 
            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`;

    return (
      <button
        key={tab.key}
        onClick={() => handleTabClick(tab.key)}
        className={`${baseClasses} transition-all duration-200`}
        role="tab"
        aria-selected={isActive}
      >
        {tab.label}
        {count > 0 && (
          <span 
            className={`ml-2 px-2 py-1 rounded-full text-xs ${
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
           {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="border-b mb-4">
      {/* Desktop View */}
      <div 
        className="hidden md:flex space-x-4"
        role="tablist"
        aria-label="IPO categories"
      >
        {TABS.map(tab => renderTabButton(tab))}
      </div>

      {/* Mobile View */}
      <div 
        className="md:hidden grid grid-cols-2 gap-2"
        role="tablist"
        aria-label="IPO categories"
      >
        {TABS.map(tab => renderTabButton(tab, true))}
      </div>
    </div>
  );
});

TabSection.displayName = 'TabSection';

export default TabSection;
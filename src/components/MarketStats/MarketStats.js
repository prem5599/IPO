// src/components/MarketStats/MarketStats.js
'use client';

import { useMemo } from 'react';
import { 
  Wallet as WalletIcon, 
  TrendingUp as TrendingUpIcon, 
  Timer as TimerIcon, 
  CheckCircle as CheckCircleIcon 
} from 'lucide-react';

export default function MarketStats({ ipoData }) {
  const stats = useMemo(() => {
    const calculateTotalIPOs = () => {
      try {
        return Object.values(ipoData).reduce((total, arr) => 
          total + (Array.isArray(arr) ? arr.length : 0), 0);
      } catch (error) {
        console.error('Error calculating total IPOs:', error);
        return 0;
      }
    };

    const getArrayLength = (arr) => {
      try {
        return Array.isArray(arr) ? arr.length : 0;
      } catch (error) {
        console.error('Error getting array length:', error);
        return 0;
      }
    };

    return [
      {
        label: 'Total IPOs',
        value: calculateTotalIPOs(),
        icon: <WalletIcon size={20} className="text-blue-500" />,
        textClass: 'text-gray-800'
      },
      {
        label: 'Active IPOs',
        value: getArrayLength(ipoData.current),
        icon: <TrendingUpIcon size={20} className="text-green-500" />,
        textClass: 'text-green-600'
      },
      {
        label: 'Upcoming IPOs',
        value: getArrayLength(ipoData.upcoming),
        icon: <TimerIcon size={20} className="text-yellow-500" />,
        textClass: 'text-yellow-600'
      },
      {
        label: 'Listed IPOs',
        value: getArrayLength(ipoData.listed),
        icon: <CheckCircleIcon size={20} className="text-blue-500" />,
        textClass: 'text-blue-600'
      }
    ];
  }, [ipoData]);

  if (!ipoData) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
        <div className="animate-pulse">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
      
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          className={`flex justify-between items-center ${
            index !== stats.length - 1 ? 'mb-3' : ''
          }`}
        >
          <div className="flex items-center space-x-2">
            {stat.icon}
            <span className="text-gray-600 text-sm">{stat.label}</span>
          </div>
          <span className={`font-bold ${stat.textClass}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
'use client';

import { useMemo } from 'react';
import { 
  Wallet as WalletIcon, 
  TrendingUp as TrendingUpIcon, 
  Timer as TimerIcon, 
  CheckCircle as CheckCircleIcon 
} from 'lucide-react';

export default function MarketStats({ ipoData }) {
  // Memoized stats calculation
  const stats = useMemo(() => [
    {
      label: 'Total IPOs',
      value: Object.values(ipoData).reduce((total, arr) => 
        total + (Array.isArray(arr) ? arr.length : 0), 0),
      icon: <WalletIcon size={20} className="text-blue-500" />,
      textClass: 'text-gray-800'
    },
    {
      label: 'Active IPOs',
      value: Array.isArray(ipoData.current) ? ipoData.current.length : 0,
      icon: <TrendingUpIcon size={20} className="text-green-500" />,
      textClass: 'text-green-600'
    },
    {
      label: 'Upcoming IPOs',
      value: Array.isArray(ipoData.upcoming) ? ipoData.upcoming.length : 0,
      icon: <TimerIcon size={20} className="text-yellow-500" />,
      textClass: 'text-yellow-600'
    },
    {
      label: 'Listed IPOs',
      value: Array.isArray(ipoData.listed) ? ipoData.listed.length : 0,
      icon: <CheckCircleIcon size={20} className="text-blue-500" />,
      textClass: 'text-blue-600'
    }
  ], [ipoData]);

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
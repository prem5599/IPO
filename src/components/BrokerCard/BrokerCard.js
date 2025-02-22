'use client';

import { memo } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import upstoxLogo from '../../../public/images/upstox-logo.jpeg';

const BrokerCard = memo(() => {
  const features = [
    { id: 1, text: 'Zero account maintenance' },
    { id: 2, text: 'Quick IPO application' },
    { id: 3, text: 'Fast UPI mandate' },
    { id: 4, text: 'Real-time IPO tracking' }
  ];

  return (
    <div 
      className="w-80 border rounded-lg shadow-sm  bg-white"
      role="region" 
      aria-label="Broker information"
    >
      <div className="p-3">
        <h4 className="text-lg font-medium">Featured Broker</h4>
        
        <div className="w-80 border rounded mt-3 p-4 " style={{width:'295px'}} >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex rounded-full bg-blue-100 w-10 h-10">
              <Image 
                src={upstoxLogo} 
                alt="Broker logo" 
                className="rounded-full object-cover"
                width={40}
                height={40}
              />
            </div>
            <div className="flex justify-between items-center flex-grow">
              <span className="font-medium text-gray-900">Upstox</span>
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                <span className="text-blue-600 font-medium">4.8</span>
                <span className="text-blue-600 ml-1" aria-hidden="true">★</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            {features.map(({ id, text }) => (
              <div key={id} className="flex items-center gap-2 mb-2">
                <Check size={16} className="text-green-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-gray-600">{text}</span>
              </div>
            ))}
          </div>

      

          <Link 
            href="/#"
            className="inline-block mt-3 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 "
            role="button"
            aria-label="Open trading account"
            style={{display:'flex', justifyContent:'center'}}
          >
            Open Account
          </Link>
        </div>
      </div>
    </div>
  );
});

BrokerCard.displayName = 'BrokerCard';

export default BrokerCard;
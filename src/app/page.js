// app/page.js
import { Suspense } from 'react';
import IPOPlatform from '../components/features/IPOPlatform/IPOPlatform';
import { getCachedIPOData } from '../services/ipoCache';
import { SEO_CONFIG } from '../lib/constants';

export const metadata = {
  title: SEO_CONFIG.default.title,
  description: SEO_CONFIG.default.description,
  openGraph: {
    title: SEO_CONFIG.default.title,
    description: SEO_CONFIG.default.description,
  },
  twitter: {
    title: SEO_CONFIG.default.title,
    description: SEO_CONFIG.default.description,
  }
};

function LoadingState() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-5">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-40 rounded-lg mb-4"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  try {
    const ipoData = await getCachedIPOData();

    return (
      <Suspense fallback={<LoadingState />}>
        <IPOPlatform initialData={ipoData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 py-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
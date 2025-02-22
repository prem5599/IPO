// app/ipo/[slug]/page.js
import { Suspense } from 'react';
import { getCachedIPOData } from '../../../services/ipoCache';
import { createSlug } from '../../../lib/utils';
import { SEO_CONFIG } from '../../../lib/constants';
import ApplyIPOButton from '../../../components/ApplyIPOButton/ApplyIPOButton';
import BrokerCard from '../../../components/BrokerCard/BrokerCard';
import { IPOContent } from '../../../components/features/IPOContent/IPOContent';

// Add the formatters import
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'TBA';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  } catch (error) {
    return 'TBA';
  }
};

export async function generateMetadata({ params }) {
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
      return {
        title: 'IPO Not Found',
        description: 'The requested IPO could not be found.',
        openGraph: {
          title: 'IPO Not Found | IPO Page',
          description: 'The requested IPO could not be found.'
        },
        twitter: {
          title: 'IPO Not Found | IPO Page',
          description: 'The requested IPO could not be found.'
        }
      };
    }

    const priceRange = ipo.min_price && ipo.max_price
      ? `${formatCurrency(ipo.min_price)} - ${formatCurrency(ipo.max_price)}`
      : 'Price TBA';

    const issueDate = ipo.bidding_start_date 
      ? `Issue Date: ${formatDate(ipo.bidding_start_date)}` 
      : 'Issue Date: TBA';

    const description = `${ipo.name} IPO - ${priceRange}. ${issueDate}. ${
      ipo.is_sme ? 'SME IPO. ' : ''
    }Check issue dates, lot size, subscription status, and apply online.`;

    const title = `${ipo.name} IPO Price, Date & Details`;

    return {
      title,
      description,
      keywords: `${ipo.name} IPO, ${ipo.symbol || ''} IPO, IPO price, IPO date, IPO application`,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/ipo/${slug}`,
        images: [{
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${ipo.name} IPO Details`
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description.slice(0, 200),
        images: ['/twitter-image.jpg']
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: SEO_CONFIG.default.title,
      description: SEO_CONFIG.default.description
    };
  }
}
function ErrorDisplay({ message }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-4">{message}</h1>
        <p className="text-red-600">
          We encountered an error while loading the IPO details. Please try again later.
        </p>
      </div>
    </div>
  );
}

export default async function IPODetailPage({ params }) {
  // Destructure slug with await
  const { slug } = await Promise.resolve(params);
  
  try {
    const ipoData = await getCachedIPOData();
    
    const allIPOs = [
      ...(ipoData?.current || []),
      ...(ipoData?.upcoming || []),
      ...(ipoData?.listed || []),
      ...(ipoData?.completed || [])
    ];
    
    const ipo = allIPOs.find(item => createSlug(item?.name || '') === slug);

    if (!ipo) {
      return <ErrorDisplay message="IPO Not Found" />;
    }

    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Suspense fallback={<div>Loading IPO details...</div>}>
              <IPOContent ipo={ipo} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Suspense fallback={<div>Loading application form...</div>}>
              <ApplyIPOButton 
                ipo={ipo}
                additionalText={ipo.additional_text}
              />
            </Suspense>
            <Suspense fallback={<div>Loading broker details...</div>}>
              <BrokerCard />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in IPODetailPage:', error);
    return <ErrorDisplay message="Something went wrong" />;
  }
}
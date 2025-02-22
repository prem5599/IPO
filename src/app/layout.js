// app/layout.js
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { getCachedIPOData } from '../services/ipoCache';
import Navbar from '../components/Navbar/Navbar';
import ErrorBoundary from '../components/shared/ErrorBoundary/ErrorBoundary';
import { SEO_CONFIG } from '../lib/constants';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  variable: '--font-inter' 
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: SEO_CONFIG.default.title,
    template: '%s | IPO Page'
  },
  description: SEO_CONFIG.default.description,
  keywords: SEO_CONFIG.default.keywords,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'IPO Page',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPO.Page - Indian IPO Platform',
    description: 'Comprehensive platform for tracking and analyzing Indian Initial Public Offerings',
    images: ['/twitter-image.jpg']
  }
};

function NavbarLoading() {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-blue-600">IPO</span>
          <span className="text-gray-800">Page</span>
        </div>
        <div className="w-full max-w-xl mx-4">
          <div className="relative">
            <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function NavigationWithData() {
  try {
    const ipoData = await getCachedIPOData();
    return <Navbar ipoData={ipoData} />;
  } catch (error) {
    console.error('Error loading navigation data:', error);
    return <NavbarLoading />;
  }
}

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable}`}
      suppressHydrationWarning={true}
    >
      <body 
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <Suspense fallback={<NavbarLoading />}>
            <NavigationWithData />
          </Suspense>
          
          <main className="flex-grow">
            <Suspense fallback={<div className="p-4">Loading content...</div>}>
              {children}
            </Suspense>
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
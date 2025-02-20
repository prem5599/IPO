import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '../components/Navbar/Navbar';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Use suppressHydrationWarning to prevent specific hydration warnings
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap' 
});

export const metadata = {
  title: 'IPO Watch - Indian IPO Platform',
  description: 'Comprehensive platform for tracking and analyzing Indian Initial Public Offerings',
  icons: {
    icon: '/favicon.ico',
  },
};

// Loading component for Navbar
function NavbarLoading() {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-blue-600">IPO</span>
          <span className="text-gray-800">Watch</span>
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

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning={true}
    >
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <Suspense fallback={<NavbarLoading />}>
            <Navbar />
          </Suspense>
          <Suspense fallback={<div className="p-4">Loading content...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}
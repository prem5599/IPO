import { Inter } from 'next/font/google';
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
          <Navbar />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
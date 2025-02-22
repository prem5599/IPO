import { SEO_CONFIG } from '../lib/constants';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'),
  title: {
    default: SEO_CONFIG.default.title,
    template: '%s | IPO Page'
  },
  description: SEO_CONFIG.default.description,
  keywords: SEO_CONFIG.default.keywords,
  authors: [{ name: 'IPO Page Team' }],
  openGraph: {
    type: 'website',
    siteName: 'IPO Page',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'IPO Page - Indian IPO Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ipopage',
    images: '/twitter-image.jpg'
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
  }
};
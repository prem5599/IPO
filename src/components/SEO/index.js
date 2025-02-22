import Head from 'next/head';
import { SEO_CONFIG } from '../../lib/constants';
import { getCanonicalUrl } from '../../lib/utils';

export default function SEO({
  title = SEO_CONFIG.default.title,
  description = SEO_CONFIG.default.description,
  keywords = SEO_CONFIG.default.keywords,
  path = '',
  ogImage = '/og-image.jpg',
  children
}) {
  const canonicalUrl = getCanonicalUrl(path);
  const fullTitle = title === SEO_CONFIG.default.title 
    ? title 
    : `${title} | IPO Page`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="IPO Page" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Additional head elements */}
      {children}
    </Head>
  );
}
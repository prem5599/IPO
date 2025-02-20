/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    async redirects() {
      return [];
    },
    async rewrites() {
      return [];
    }
  }
  
  module.exports = nextConfig
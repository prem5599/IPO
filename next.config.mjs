/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['stock.indianapi.in', 'localhost'],
    },
    experimental: {
      serverComponentsExternalPackages: ['axios'],
      optimizeCaching: true,
    },
    async redirects() {
      return [
        {
          source: '/ipo/:id',
          destination: '/ipo/:id',
          permanent: true,
        },
      ];
    },
    webpack: (config) => {
      config.resolve.fallback = { 
        fs: false, 
        net: false, 
        tls: false 
      };
      return config;
    },
  };
  
  export default nextConfig;
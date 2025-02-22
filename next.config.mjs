/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['stock.indianapi.in', 'localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['axios'],
    optimizeCaching: true,
    webpackHotUpdate: false
  },
  webpack: (config) => {
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'WebpackHotModuleReplacementPlugin'
    );
    
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    
    return config;
  }
};

export default nextConfig;
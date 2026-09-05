const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled for Three.js/Potree compat
  transpilePackages: ['react-map-gl', 'maplibre-gl'],
  images: {
    domains: ['localhost', 'server.arcgisonline.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  webpack: (config) => {
    // Ensure mapbox-gl stub so react-map-gl's mapbox entry never crashes
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'maplibre-gl',
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);

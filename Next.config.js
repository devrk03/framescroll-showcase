/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Good practice
  // images: { unoptimized: true, etc } - Omit this to use default optimization
  // assetPrefix and basePath - Omit these for root domain deployments
};

module.exports = nextConfig;

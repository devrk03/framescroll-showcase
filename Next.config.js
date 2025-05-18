const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/scroll-native' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/scroll-native' : '',
}

module.exports = nextConfig

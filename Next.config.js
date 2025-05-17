const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/parallaxvision' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/parallaxvision' : '',
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['images.unsplash.com']
  }
}

module.exports = nextConfig

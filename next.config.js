/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['avatars.githubusercontent.com']
  }
}

module.exports = nextConfig

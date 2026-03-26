/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

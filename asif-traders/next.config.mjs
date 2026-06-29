/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Add all category and product slugs for static generation
  async routes() {
    return [];
  },
};

export default nextConfig;

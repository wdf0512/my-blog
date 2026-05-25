/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Redirect legacy pre-locale digest URLs to their /digest/zh/ counterparts.
  // Only the four legacy ZH-only issues (no -en/-zh slug suffix) need this.
  async redirects() {
    return [
      {
        source: '/digest/:slug(horizon-\\d{4}-\\d{2}-\\d{2})',
        destination: '/digest/zh/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

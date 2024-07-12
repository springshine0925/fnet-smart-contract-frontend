/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'],
    unoptimized: true
  },
  trailingSlash: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;

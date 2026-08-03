/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['supabase.co', 'storage.googleapis.com'],
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
};

module.exports = nextConfig;

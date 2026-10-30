import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use the compiler API in-process; the managed runner blocks child CLI stdout.
  experimental: { useTypeScriptCli: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;

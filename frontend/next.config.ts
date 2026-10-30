import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript is checked by the dedicated `npm run typecheck` script. This
  // avoids Next's bundled --showConfig parser incompatibility in this setup.
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;

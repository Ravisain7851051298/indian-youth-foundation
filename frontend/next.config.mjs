/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', 'react-icons/fi', 'react-icons/fa6', 'react-icons/fa'],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: '**' }
    ]
  },
  async rewrites() {
    const rawTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanTarget = rawTarget.trim().replace(/\/api\/?$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${cleanTarget}/api/:path*`
      },
      {
        source: '/uploads/:path*',
        destination: `${cleanTarget}/uploads/:path*`
      }
    ];
  }
};

export default nextConfig;

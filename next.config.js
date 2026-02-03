/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    
    images: {
      domains: ['localhost'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  
    // Enable React strict mode
    reactStrictMode: true,
  
    // Experimental features
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
  
    // Environment variables
    env: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
  };
  
  export default nextConfig;
  
  
  
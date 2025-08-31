/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sms-hub/ui', '@sms-hub/types', '@sms-hub/utils', '@sms-hub/supabase', '@sms-hub/hub-logic'],
  experimental: {
    optimizePackageImports: ['@sms-hub/ui', '@sms-hub/utils']
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  images: {
    domains: ['localhost', 'supabase.com'],
  },
  async redirects() {
    return [
      {
        source: '/gnymble',
        destination: '/?hub=gnymble',
        permanent: false,
      },
      {
        source: '/percymd',
        destination: '/?hub=percymd',
        permanent: false,
      },
      {
        source: '/percytext',
        destination: '/?hub=percytext',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
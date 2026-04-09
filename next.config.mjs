/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  allowedDevOrigins: [
    '*.replit.dev',
    '*.pike.replit.dev',
    '*.repl.co',
  ],
};

export default nextConfig;

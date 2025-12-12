/** @type {import('next').NextConfig} */
// Enable static export only when building for mobile (via NEXT_EXPORT env var)
// For web development, don't set NEXT_EXPORT so API routes work
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Only enable static export when NEXT_EXPORT=true (for mobile builds)
  ...(process.env.NEXT_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: false,
  }),
};
export default nextConfig;
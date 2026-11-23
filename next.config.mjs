/** @type {import('next').NextConfig} */
// The site is served from the domain root on Vercel (https://nba.shoulin.shop).
// GitHub Pages project sites live under /<repo>/, so that build sets
// NEXT_PUBLIC_BASE_PATH=/nba-tools instead of hard-coding the prefix here.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Static export so the whole site can be served with no runtime server.
  output: "export",
  basePath,
  images: { unoptimized: true },
  // Separate cache directory for the static-export build. Dev gets its own
  // directory so `next dev` never wipes the export that `npm run preview` serves.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next-export",
};

export default nextConfig;

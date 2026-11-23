/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the whole site can be served from GitHub Pages with no runtime server.
  output: "export",
  // GitHub Pages project sites are served under /<repo-name>/.
  basePath: "/nba-tools",
  images: { unoptimized: true },
  // Separate cache directory for the static-export build. Dev gets its own
  // directory so `next dev` never wipes the export that `npm run preview` serves.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next-export",
};

export default nextConfig;

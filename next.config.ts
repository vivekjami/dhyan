import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  experimental: {
    // appDir: true, // Removed as it is not a valid property
  },
};

export default nextConfig;

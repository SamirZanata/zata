import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Permite fetch para localhost em Server Components
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3333'],
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
    serverActions: {
      // allowedOrigins: [""]
    },
  },
};

export default nextConfig;

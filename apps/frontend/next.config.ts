import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
    serverActions: {
      allowedOrigins: ["http://3.104.128.100"], // ✅ your EC2 public IP or domain
    },
  },
};

export default nextConfig;

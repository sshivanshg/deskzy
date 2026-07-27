import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const api = process.env.DESKZY_API_PROXY || "http://localhost:8080";
    return [
      {
        source: "/deskzy-api/:path*",
        destination: `${api}/:path*`,
      },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();

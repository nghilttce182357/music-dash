import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Proxy API requests to external service to bypass CORS
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://musicplayer.blocktrend.xyz/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
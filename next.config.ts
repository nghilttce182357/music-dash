import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép ảnh từ Cloudinary (và bạn có thể thêm nhiều domain khác nếu cần)
  images: {
    domains: ["res.cloudinary.com"],
  },

  // Cấu hình webpack sẵn có của bạn
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

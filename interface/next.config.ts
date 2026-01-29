import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;

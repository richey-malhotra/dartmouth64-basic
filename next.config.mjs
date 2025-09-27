/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  webpack: (config) => {
    // Handle Monaco Editor
    config.module.rules.push({
      test: /\.woff2?$/,
      type: "asset/resource"
    });
    return config;
  }
};

export default nextConfig;
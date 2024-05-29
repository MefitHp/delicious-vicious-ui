/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "delicious-vicious.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "delicious-vicious.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    deviceSizes: [576, 768, 992, 1200, 1440],
    imageSizes: [16, 32, 48, 64, 96],
  },
  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "delicious-vicious.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
  },
};

export default nextConfig;

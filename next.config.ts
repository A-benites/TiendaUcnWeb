/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shop.songprinting.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

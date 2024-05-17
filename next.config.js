/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experiments: {
    topLevelAwait: true,
  },
};

module.exports = nextConfig;

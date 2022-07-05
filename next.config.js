/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/aap/innsyn",
  trailingSlash: true,
  reactStrictMode: true,

  experimental: {
    outputStandalone: true,
  },
};

module.exports = nextConfig;

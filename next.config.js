/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: '/aap/mine-aap',
  trailingSlash: true,
  reactStrictMode: true,
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX ?? undefined,

  i18n: {
    locales: ['nb', 'nn'],
    defaultLocale: 'nb',
  },
};

module.exports = nextConfig;

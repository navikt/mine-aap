/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
};

const nextConfig = {
  basePath: '/aap/innsyn',
  trailingSlash: true,
  reactStrictMode: true,
  output: 'standalone',

  i18n: {
    locales: ['nb'],
    defaultLocale: 'nb',
  },
};

if (process.env.ENABLE_SENTRY === 'true') {
  console.log('sentry enabled', process.env.ENABLE_SENTRY);
  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} else {
  module.exports = nextConfig;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure all pages render with Brazilian Portuguese locale
  i18n: {
    locales: ["pt-BR"],
    defaultLocale: "pt-BR",
  },
};

module.exports = nextConfig;

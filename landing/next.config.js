/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",       // static export → generates out/ for nginx on VPS
  reactStrictMode: true,
  // Disable telemetry in CI
  ...(process.env.CI && { env: { NEXT_TELEMETRY_DISABLED: "1" } }),
};

module.exports = nextConfig;

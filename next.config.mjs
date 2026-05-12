/** @type {import('next').NextConfig} */
const nextConfig = {
  // Playwright + axe-core can't be bundled — keep them as Node-side externals.
  serverExternalPackages: ["playwright", "@axe-core/playwright"],
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;

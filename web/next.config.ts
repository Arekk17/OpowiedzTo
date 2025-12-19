import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wyklucz pliki Storybook z builda
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Wyłącz prerenderowanie dla wszystkich stron
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

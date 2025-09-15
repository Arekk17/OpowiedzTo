import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        "@/components": path.resolve(__dirname, "../src/components"),
        "@/lib": path.resolve(__dirname, "../src/lib"),
        "@/types": path.resolve(__dirname, "../src/types"),
        "@/hooks": path.resolve(__dirname, "../src/hooks"),
        "@/utils": path.resolve(__dirname, "../src/utils"),
        // Alias do mocka App Routera w Storybooku
        "next/navigation": path.resolve(
          __dirname,
          "./mocks/next-navigation.ts"
        ),
      };
    }

    if (!config.css) {
      config.css = {};
    }

    config.css.postcss = path.resolve(__dirname, "../postcss.config.mjs");

    return config;
  },
};
export default config;

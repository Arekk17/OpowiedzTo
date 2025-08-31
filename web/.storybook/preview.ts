import type { Preview } from "@storybook/nextjs-vite";
import * as NextImage from "next/image";
import React from "react";
import "../src/app/globals.css";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props: React.ComponentProps<typeof OriginalNextImage>) =>
    React.createElement(OriginalNextImage, { ...props, unoptimized: true }),
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#fefefe",
        },
        {
          name: "dark",
          value: "#1f2937",
        },
      ],
    },
  },
};

export default preview;

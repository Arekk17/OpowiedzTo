import type { Preview } from "@storybook/nextjs";
import React from "react";
import "./preview.css";
import { QueryProvider } from "../src/providers/query-provider";

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

    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/stories",
        query: { page: "3" },
      },
    },
  },

  decorators: [
    (Story) =>
      React.createElement(
        QueryProvider,
        null,
        React.createElement(
          "div",
          {
            className: "font-jakarta antialiased",
            style: {
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            },
          },
          React.createElement(Story)
        )
      ),
  ],
};

export default preview;

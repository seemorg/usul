import type { Preview } from "@storybook/react";
import React from "react";

import "../src/styles/globals.css";
import "./storybook.css";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="font-sans">{children}</div>;
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      exclude: [
        "asChild",
        "onLayout",
        "tagName",
        "keyboardResizeBy",
        "id",
        "autoSaveId",
        "storage",
      ],
    },
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
};

export default preview;

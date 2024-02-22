import type { Preview } from "@storybook/react";
import React from "react";
import { cn } from "../src/lib/utils";
import { getFontsClassnames } from "../src/lib/fonts";

import "../src/styles/globals.css";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={cn("font-sans", getFontsClassnames())}>{children}</div>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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

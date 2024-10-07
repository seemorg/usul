import type { Preview } from "@storybook/react";
import React from "react";

import "../src/styles/globals.css";
import "./storybook.css";
import { NextIntlClientProvider } from "next-intl";
import { getSharedConfig } from "../src/i18n";

import common from "../locales/en/common.json";
import entities from "../locales/en/entities.json";
import home from "../locales/en/home.json";
import meta from "../locales/en/meta.json";
import reader from "../locales/en/reader.json";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider
      messages={{
        common,
        entities,
        home,
        meta,
        reader,
      }}
      locale="en-US"
      {...getSharedConfig()}
    >
      <div className="font-sans">{children}</div>
    </NextIntlClientProvider>
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

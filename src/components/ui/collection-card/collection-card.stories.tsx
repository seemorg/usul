import type { Meta, StoryObj } from "@storybook/react";

import { CollectionCard } from "./index";

const meta = {
  title: "CollectionCard",
  component: CollectionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    patternSrcPrefix: {
      control: false,
    },
  },
} satisfies Meta<typeof CollectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: "My Collection",
    numberOfBooks: 10,
    pattern: 1,
    color: "gray",
    patternSrcPrefix: "patterns/",
  },
};

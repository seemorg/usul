import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./index";

const meta = {
  title: "Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Badge",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Badge",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Badge",
  },
};

export const Pill: Story = {
  args: {
    shape: "pill",
    children: "Badge",
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./index";
import { Label } from "../label";

const meta = {
  title: "Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    placeholder: "Enter some text",
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WithLabel: Story = {
  render: () => (
    <div>
      <Label htmlFor="input">Label</Label>
      <Input id="input" placeholder="Enter some text" />
    </div>
  ),
};

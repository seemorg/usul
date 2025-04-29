import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

const meta = {
  title: "Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex min-h-[250px] items-center justify-center">
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>The React Framework – created and maintained by @vercel.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

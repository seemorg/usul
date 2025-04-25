import type { Meta, StoryObj } from "@storybook/react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./index";

const meta = {
  title: "HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex min-h-[250px] items-center justify-center">
      <HoverCard {...args}>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>
          The React Framework – created and maintained by @vercel.
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

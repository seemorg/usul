import type { Meta, StoryObj } from "@storybook/react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./index";
import { Button } from "../button";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex min-h-[250px] items-center justify-center">
      <TooltipProvider>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            The React Framework – created and maintained by @vercel.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

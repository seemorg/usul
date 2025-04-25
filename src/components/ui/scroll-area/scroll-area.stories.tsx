import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { ScrollArea } from "./index";

type MetaType = Meta<ComponentProps<typeof ScrollArea>>;

const meta = {
  title: "ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies MetaType;

export default meta;

type Story = StoryObj<MetaType>;

export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      Jokester began sneaking into the castle in the middle of the night and
      leaving jokes all over the place: under the king pillow, in his soup, even
      in the royal toilet. The king was furious, but he couldnt seem to stop
      Jokester. And then, one day, the people of the kingdom discovered that the
      jokes left by Jokester were so funny that they couldnt help but laugh. And
      once they started laughing, they couldnt stop.
    </ScrollArea>
  ),
};

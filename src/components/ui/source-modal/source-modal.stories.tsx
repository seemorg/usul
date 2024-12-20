import type { Meta, StoryObj } from "@storybook/react";

import SourceModal from "./index";

const meta = {
  title: "SourceModal",
  component: SourceModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof SourceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// @ts-ignore
export const Basic: Story = {
  render: () => (
    <SourceModal
      source={{
        metadata: {
          chapters: ["Chapter 1"],
          pages: [{ vol: "1", page: 1 }],
        },
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      }}
      // @ts-ignore
      getVirtuosoScrollProps={() => {}}
    />
  ),
};

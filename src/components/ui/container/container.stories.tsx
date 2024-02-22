import type { Meta, StoryObj } from "@storybook/react";

import Container from "./index";

const meta = {
  title: "Container",
  component: Container,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: () => (
    <Container className="relative rounded-md border border-gray-200">
      <div className="h-44" />

      <svg
        className="absolute inset-0 h-full w-full bg-white stroke-gray-900/15"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-41542215-11f8-4ef6-8c7c-b6dad8789af9"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-41542215-11f8-4ef6-8c7c-b6dad8789af9)"
          width="100%"
          height="100%"
        />
      </svg>
    </Container>
  ),
};

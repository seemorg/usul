import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./index";

type MetaType = Meta<
  ComponentProps<typeof ResizablePanelGroup> & {
    withHandle: boolean;
  }
>;

const meta = {
  title: "Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    withHandle: {
      type: "boolean",
      defaultValue: true,
    },
  },
} satisfies MetaType;

export default meta;

type Story = StoryObj<MetaType>;

export const Basic: Story = {
  args: {
    direction: "horizontal",
  },
  render: ({ withHandle, ...args }) => (
    <div className="flex min-h-[250px] w-[600px] items-center justify-center">
      <ResizablePanelGroup
        className="w-full max-w-md rounded-lg border"
        {...args}
      >
        <ResizablePanel defaultSize={300}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle={withHandle} />

        <ResizablePanel defaultSize={300}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={100}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle={withHandle} />

            <ResizablePanel defaultSize={200}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

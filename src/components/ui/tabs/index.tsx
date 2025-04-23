"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

const Tabs = TabsPrimitive.Root;

const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn(
      "border-border bg-muted text-muted-foreground dark:bg-accent/80 inline-flex h-[38px] items-center justify-center rounded-lg border p-[3px]",
      className,
    )}
    {...props}
  />
);

const TabsTrigger = ({
  className,
  tooltip,
  tooltipProps,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  tooltip?: string;
  tooltipProps?: React.ComponentProps<typeof TooltipContent>;
}) => {
  const showTooltip = !!tooltip;

  const trigger = (
    <TabsPrimitive.Trigger
      className={cn(
        "ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex h-full items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 data-[state=active]:shadow-sm",
        !showTooltip && "px-3 disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {showTooltip ? (
        <Tooltip>
          <TooltipTrigger
            className="flex h-full w-full items-center justify-center px-3"
            asChild
          >
            <span>{children}</span>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
          </TooltipPortal>
        </Tooltip>
      ) : (
        children
      )}
    </TabsPrimitive.Trigger>
  );

  return trigger;
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    className={cn(
      "ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };

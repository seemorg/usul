"use client";

import { cn } from "@/lib/utils";
import { Tabs as TabsPrimitive, Tooltip as TooltipPrimitive } from "radix-ui";

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

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
        "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex h-full items-center justify-center rounded text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:opacity-50 data-[state=active]:shadow-sm",
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
          <TooltipPrimitive.Portal>
            <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
          </TooltipPrimitive.Portal>
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
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
      className,
    )}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };

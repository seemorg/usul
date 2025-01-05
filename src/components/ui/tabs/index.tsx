"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-[38px] items-center justify-center rounded-lg border border-border bg-muted p-[3px] text-muted-foreground dark:bg-accent/80",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    tooltip?: string;
    tooltipProps?: React.ComponentPropsWithoutRef<typeof TooltipContent>;
  }
>(({ className, tooltip, tooltipProps, children, ...props }, ref) => {
  const showTooltip = !!tooltip;

  const trigger = (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex h-full items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
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
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

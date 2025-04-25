"use client";

import { cn } from "@/lib/utils";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "bg-border shrink-0",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
);

export { Separator };

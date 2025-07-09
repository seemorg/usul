"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

const Checkbox = ({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    className={cn(
      "bg-background ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary dark:border-border peer size-5 shrink-0 rounded-sm border border-gray-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

export { Checkbox };

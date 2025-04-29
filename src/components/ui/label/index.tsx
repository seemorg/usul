"use client";

import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label as LabelPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";

const labelVariants = cva(
  "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />
);

export { Label };

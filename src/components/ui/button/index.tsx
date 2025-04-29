import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: string;
  tooltipProps?: React.ComponentProps<typeof TooltipContent>;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  tooltip,
  tooltipProps = {},
  ...props
}: ButtonProps) => {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  const result = (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );

  if (!tooltip) return result;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{result}</TooltipTrigger>
      <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export { Button, buttonVariants };

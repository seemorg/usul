import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";

import Spinner from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
        ghost: "hover:bg-accent/10 focus:bg-accent/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: string;
  tooltipProps?: React.ComponentProps<typeof TooltipContent>;
  isLoading?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  tooltip,
  tooltipProps,
  isLoading = false,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  const content = (
    <Comp
      className={cn(buttonVariants({ variant, size, rounded }), className)}
      {...props}
    >
      {isLoading ? <Spinner className="size-4 text-current" /> : children}
    </Comp>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export { Button, buttonVariants };

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const ReaderNavigationButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "size-9 rounded-lg bg-background shadow-none hover:bg-accent hover:text-accent-foreground focus:bg-accent md:border md:border-border [&_svg]:size-5",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

ReaderNavigationButton.displayName = "ReaderNavigationButton";

export default ReaderNavigationButton;

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const ReaderNavigationButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("hover:bg-accent focus:bg-accent", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

ReaderNavigationButton.displayName = "ReaderNavigationButton";

export default ReaderNavigationButton;

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ReaderNavigationButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "focus-visible:ring-ring inline-flex items-center justify-center text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
        "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent md:border-border size-9 rounded-lg border-0 shadow-none md:border [&_svg]:size-5",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ReaderNavigationButton;

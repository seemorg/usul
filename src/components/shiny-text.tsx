import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  shimmerWidth?: number;
  disabled?: boolean;
}

export const ShinyText = ({
  children,
  disabled = false,
  shimmerWidth = 5,
  className,
  ...props
}: ShinyTextProps) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "text-muted-foreground/70",

        // Shine effect
        !disabled &&
          "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        !disabled &&
          "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

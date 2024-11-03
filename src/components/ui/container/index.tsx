import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-5xl px-4 py-2 2xl:max-w-6xl",
          className,
        )}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

export default Container;

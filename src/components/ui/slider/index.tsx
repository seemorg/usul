"use client";

import { cn } from "@/lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";

const Slider = ({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) => {
  const value = props.value ?? props.defaultValue;

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>

      {value?.map((_, idx) => (
        <SliderPrimitive.Thumb
          key={idx}
          className="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
};

export { Slider };

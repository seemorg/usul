"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SlideProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const Slider = ({ className, ...props }: SlideProps) => {
  const value = props.value ?? props.defaultValue;

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
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
          className="border-primary bg-background ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
};

export { Slider };

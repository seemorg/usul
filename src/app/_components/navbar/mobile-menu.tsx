"use client";

import { RemoveScroll } from "react-remove-scroll";
import { Slot } from "@radix-ui/react-slot";
import { Portal } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export default function MobileMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Portal>
      <RemoveScroll as={Slot} allowPinchZoom enabled>
        <div className={cn("fixed inset-0 z-[40] bg-background", className)}>
          {children}
        </div>
      </RemoveScroll>
    </Portal>
  );
}

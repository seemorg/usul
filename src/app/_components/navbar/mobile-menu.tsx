"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Portal } from "@radix-ui/themes";
import { RemoveScroll } from "react-remove-scroll";

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
        <div
          className={cn(
            "bg-background fixed inset-0 z-40 overflow-y-auto",
            className,
          )}
        >
          {children}
        </div>
      </RemoveScroll>
    </Portal>
  );
}

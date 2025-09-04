"use client";

import { cn } from "@/lib/utils";
import { Slot as SlotPrimitive, Portal as PortalPrimitive } from "radix-ui";
import { RemoveScroll } from "react-remove-scroll";

export default function MobileMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortalPrimitive.Portal>
      <RemoveScroll as={SlotPrimitive.Slot} allowPinchZoom enabled>
        <div
          className={cn(
            "bg-background fixed inset-0 z-40 overflow-y-auto",
            className,
          )}
        >
          {children}
        </div>
      </RemoveScroll>
    </PortalPrimitive.Portal>
  );
}

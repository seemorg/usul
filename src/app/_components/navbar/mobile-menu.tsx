"use client";

import { RemoveScroll } from "react-remove-scroll";
import { Slot } from "@radix-ui/react-slot";
import { Portal } from "@radix-ui/themes";

export default function MobileMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Portal>
      <RemoveScroll as={Slot} allowPinchZoom enabled>
        <div className="fixed inset-0 z-[1] bg-background">{children}</div>
      </RemoveScroll>
    </Portal>
  );
}

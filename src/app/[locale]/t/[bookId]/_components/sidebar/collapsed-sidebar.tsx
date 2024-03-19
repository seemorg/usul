"use client";

import { Button } from "@/components/ui/button";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import type { RefObject } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface CollapsedSidebarProps {
  sidebarRef: RefObject<ImperativePanelHandle>;
}

export default function CollapsedSidebar({
  sidebarRef,
}: CollapsedSidebarProps) {
  const handleClick = () => {
    sidebarRef.current?.resize(25); // 25 is the default size
  };

  return (
    <div className="sticky top-0 flex h-screen flex-none flex-col items-center justify-center bg-slate-50 shadow-inner dark:bg-slate-700">
      <div className="absolute bottom-0 top-0 z-0 w-px bg-border ltr:left-0 rtl:right-0" />
      <div className="pointer-events-none absolute inset-y-0 w-[50vw] max-w-full ltr:left-0 rtl:right-0" />

      <Button
        size="icon"
        variant="ghost"
        className="text-gray-500"
        onClick={handleClick}
      >
        <ChevronDoubleLeftIcon className="h-5 w-5 rtl:rotate-180" />
      </Button>
    </div>
  );
}

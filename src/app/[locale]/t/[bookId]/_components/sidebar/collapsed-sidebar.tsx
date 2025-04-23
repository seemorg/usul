"use client";

import { Button } from "@/components/ui/button";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import type { RefObject } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface CollapsedSidebarProps {
  sidebarRef: RefObject<ImperativePanelHandle | null>;
}

export default function CollapsedSidebar({
  sidebarRef,
}: CollapsedSidebarProps) {
  const handleClick = () => {
    sidebarRef.current?.resize(25); // 25 is the default size
  };

  return (
    <div className="sticky top-0 flex h-screen flex-none flex-col items-center justify-center bg-background dark:bg-card">
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground"
        onClick={handleClick}
      >
        <ChevronDoubleLeftIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

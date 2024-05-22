"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useRef, useState } from "react";
import Navbar from "@/app/_components/navbar";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";
import CollapsedSidebar from "./collapsed-sidebar";
import { useDirection } from "@/lib/locale/utils";

const defaultSizes = [75, 25];

export default function SidebarResizer({
  children,
  sidebar,
  secondNav,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  secondNav?: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dir = useDirection();

  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const onCollapse = () => {
    setIsCollapsed(true);
  };

  const onExpand = () => {
    setIsCollapsed(false);
  };

  const panels = [
    <ResizablePanel key="reader" defaultSize={defaultSizes[0]} minSize={55}>
      {children}
    </ResizablePanel>,
    <ResizableHandle key="handle" withHandle className="hidden lg:flex" />,
    <ResizablePanel
      key="sidebar"
      collapsible={true}
      id="sidebar-panel"
      defaultSize={defaultSizes[1]}
      ref={sidebarRef}
      collapsedSize={4}
      minSize={15}
      maxSize={45}
      onCollapse={onCollapse}
      onExpand={onExpand}
      className={cn(
        "hidden lg:block",
        isCollapsed && "min-w-[20px] transition-all duration-300 ease-in-out",
      )}
    >
      {isCollapsed ? <CollapsedSidebar sidebarRef={sidebarRef} /> : sidebar}
    </ResizablePanel>,
  ];

  return (
    <>
      <Navbar secondNav={secondNav} />

      {dir === "ltr" ? (
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="reader-sidebar"
          className="relative h-full w-full"
        >
          {panels}
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="reader-sidebar-rtl"
          className="relative h-full w-full"
        >
          {panels.reverse()}
        </ResizablePanelGroup>
      )}
    </>
  );
}

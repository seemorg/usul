"use client";

import type { ImperativePanelHandle } from "react-resizable-panels";
import React, { useRef, useState } from "react";
import Navbar from "@/app/_components/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDirection } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar";

import CollapsedSidebar from "./collapsed-sidebar";

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
  const showNavbar = useNavbarStore((s) => s.showNavbar);

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
        "hidden transition-transform duration-250 will-change-transform lg:block",
        isCollapsed && "min-w-[20px] transition-all duration-300 ease-in-out",
        !showNavbar && "translate-y-[60px]", // READER_NAVIGATION_HEIGHT
      )}
    >
      {isCollapsed ? <CollapsedSidebar sidebarRef={sidebarRef} /> : sidebar}
    </ResizablePanel>,
  ];

  // -translate-y-[READER_NAVIGATION_HEIGHT + NAVBAR_HEIGHT]
  const navbarTranslateY =
    !showNavbar && "-translate-y-[124px] lg:-translate-y-[140px]";

  return (
    <>
      <Navbar layout="reader" secondNav={secondNav} />

      {dir === "ltr" ? (
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="reader-sidebar"
          className={cn(
            "relative h-full w-full transition-transform duration-250 will-change-transform",
            navbarTranslateY,
          )}
        >
          {panels}
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="reader-sidebar-rtl"
          className={cn(
            "relative h-full w-full transition-transform duration-250 will-change-transform",
            navbarTranslateY,
          )}
        >
          {panels.reverse()}
        </ResizablePanelGroup>
      )}
    </>
  );
}

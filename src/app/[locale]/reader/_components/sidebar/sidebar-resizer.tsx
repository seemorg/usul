"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import ReaderNavbar from "../navbar";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";
import CollapsedSidebar from "./collapsed-sidebar";

const defaultSizes = [75, 25];

export default function SidebarResizer({
  children,
  sidebar,
  defaultLayout = defaultSizes,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  const onCollapse = () => {
    setIsCollapsed(true);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify({
      collapsed: true,
    })}`;
  };

  const onExpand = () => {
    setIsCollapsed(false);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify({
      collapsed: false,
    })}`;
  };

  return (
    <>
      <ReaderNavbar contentContainerRef={containerRef} />

      <ResizablePanelGroup
        direction="horizontal"
        onLayout={onLayout}
        className="relative h-full w-full"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={55}>
          <div
            className="relative h-screen w-full overflow-y-auto"
            dir="rtl"
            ref={containerRef}
          >
            {children}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden lg:flex" />

        <ResizablePanel
          collapsible={true}
          id="sidebar-panel"
          defaultSize={defaultLayout[1]}
          ref={sidebarRef}
          collapsedSize={4}
          minSize={15}
          maxSize={45}
          onCollapse={onCollapse}
          onExpand={onExpand}
          className={cn(
            "hidden lg:block",
            isCollapsed &&
              "min-w-[20px] transition-all duration-300 ease-in-out",
          )}
        >
          {isCollapsed ? <CollapsedSidebar sidebarRef={sidebarRef} /> : sidebar}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

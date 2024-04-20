"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useRef, useState } from "react";
import Navbar from "../../../../../_components/navbar";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";
import CollapsedSidebar from "./collapsed-sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import {
  StarIcon,
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";

const defaultSizes = [75, 25];

const tabs = [
  {
    id: "notes",
    label: "notes",
    icon: PencilSquareIcon,
  },
  {
    id: "bookmarks",
    label: "bookmarks",
    icon: StarIcon,
  },
  {
    id: "search",
    label: "search",
    icon: DocumentMagnifyingGlassIcon,
  },

  {
    id: "content",
    label: "content",
    icon: ListBulletIcon,
  },
] satisfies {
  label: NamespaceTranslations<"reader">;
  id: string;
  icon: any;
}[];

export default function SidebarResizer({
  children,
  sidebar,
  defaultLayout = defaultSizes,
  defaultCollapsed = false,
  secondNav,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  secondNav?: React.ReactNode;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

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
      <Navbar secondNav={secondNav} />

      <ResizablePanelGroup
        direction="horizontal"
        onLayout={onLayout}
        className="relative h-full w-full"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={55}>
          {children}
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

"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext } from "react";
import { useBoolean } from "usehooks-ts";
import { useTabNavigate } from "./sidebar/useTabNavigate";
import { type TabProps, tabs } from "./sidebar/tabs";
import { TabContent } from "./tab-content";

interface MobileSidebarValue {
  closeSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarValue>(
  {} as MobileSidebarValue,
);

export function MobileSidebarProvider({
  icon,
  tabId,
  bookSlug,
  versionId,
}: {
  icon: React.ReactNode;
  tabId: string;
} & TabProps) {
  const open = useBoolean(false);

  const { handleNavigate } = useTabNavigate();
  const rawActiveTabId = useSearchParams().get("tab");
  const activeTabId =
    tabs.find((tab) => tab.id === rawActiveTabId)?.id ?? tabs[0]!.id;

  const closeSidebar = useCallback(() => {
    open.setFalse();
  }, [open]);

  return (
    <MobileSidebarContext.Provider value={{ closeSidebar }}>
      <Sheet open={open.value} onOpenChange={open.setValue}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-full flex-1 text-black"
            onClick={() => handleNavigate(tabId)}
          >
            {icon}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full overflow-y-auto bg-slate-50 pb-10 pt-16 dark:bg-card [&>div]:p-0">
          <TabContent
            tabId={activeTabId}
            bookSlug={bookSlug}
            versionId={versionId}
          />
        </SheetContent>
      </Sheet>
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext } from "react";
import { useBoolean } from "usehooks-ts";
import { useTabNavigate } from "./sidebar/useTabNavigate";

interface MobileSidebarValue {
  closeSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarValue>(
  {} as MobileSidebarValue,
);

export function MobileSidebarProvider({
  children,
  icon,
  tabId,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tabId: string;
}) {
  const open = useBoolean(false);

  const { handleNavigate, isPending } = useTabNavigate();
  const activeTabId = useSearchParams().get("tab");

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
            onClick={() => (isPending ? null : handleNavigate(tabId))}
            disabled={isPending}
          >
            {icon}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full overflow-y-auto bg-slate-50 pb-10 pt-16 dark:bg-card [&>div]:p-0">
          {activeTabId === tabId ? children : null}
        </SheetContent>
      </Sheet>
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createContext, useCallback, useContext } from "react";
import { useBoolean } from "usehooks-ts";

interface MobileSidebarValue {
  closeSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarValue>(
  {} as MobileSidebarValue,
);

export function MobileSidebarProvider({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  const open = useBoolean(false);

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
          >
            {icon}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full overflow-y-auto bg-slate-50 pb-10 pt-16 dark:bg-card [&>div]:p-0">
          {children}
        </SheetContent>
      </Sheet>
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

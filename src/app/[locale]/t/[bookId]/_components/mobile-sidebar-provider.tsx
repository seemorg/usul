"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, usePathname } from "@/navigation";
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
  href,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  href: string;
}) {
  const open = useBoolean(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => {
    open.setFalse();
  }, [open]);

  return (
    <MobileSidebarContext.Provider value={{ closeSidebar }}>
      <Sheet open={open.value} onOpenChange={open.setValue}>
        <SheetTrigger asChild>
          <Link href={href} className="w-full flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-full text-black"
            >
              {icon}
            </Button>
          </Link>
        </SheetTrigger>

        <SheetContent className="w-full overflow-y-auto bg-slate-50 pb-10 pt-16 dark:bg-card [&>div]:p-0">
          {pathname === href ? children : null}
        </SheetContent>
      </Sheet>
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

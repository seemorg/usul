"use client";

import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showNavbar } = useNavbarStore();

  return (
    <div
      className={cn(
        "sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-slate-50 pb-16 pt-10 shadow-inner transition-transform will-change-transform dark:bg-slate-700",
        showNavbar && "lg:translate-y-14",
      )}
    >
      {children}
    </div>
  );
}

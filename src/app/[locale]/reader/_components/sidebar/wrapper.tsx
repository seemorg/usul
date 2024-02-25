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
        "sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-slate-50 shadow-inner",
        showNavbar ? "pt-24" : "pt-10",
      )}
    >
      {children}
    </div>
  );
}

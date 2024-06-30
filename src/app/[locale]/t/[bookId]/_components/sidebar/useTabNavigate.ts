"use client";

import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export const useTabNavigate = () => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const activeTabId = useSearchParams().get("tab") ?? "content";

  const handleNavigate = (tabId: string) => {
    if (tabId === activeTabId) return;

    const href = tabId === "content" ? pathname : `${pathname}?tab=${tabId}`;
    startTransition(() => {
      replace(href);
    });
  };

  return { handleNavigate, isPending };
};

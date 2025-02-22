"use client";

import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type AppLocale, routing } from "~/i18n.config";

export const useTabNavigate = () => {
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;

  const searchParams = useSearchParams();
  const activeTabId = searchParams.get("tab") ?? "content";

  const handleNavigate = (tabId: string) => {
    if (tabId === activeTabId) return;

    const base =
      locale === routing.defaultLocale
        ? pathname
        : `/${appLocaleToPathLocale(locale)}${pathname}`;

    const newSearchParams = new URLSearchParams(searchParams);
    if (tabId === "content") {
      newSearchParams.delete("tab");
    } else {
      newSearchParams.set("tab", tabId);
    }

    const href =
      newSearchParams.size > 0 ? `${base}?${newSearchParams.toString()}` : base;

    window.history.replaceState(null, "", href);
  };

  return { handleNavigate };
};

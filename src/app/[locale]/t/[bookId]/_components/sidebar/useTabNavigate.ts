"use client";

import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils";
import { usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type AppLocale, defaultLocale } from "~/i18n.config";

export const useTabNavigate = () => {
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;

  const activeTabId = useSearchParams().get("tab") ?? "content";

  const handleNavigate = (tabId: string) => {
    if (tabId === activeTabId) return;

    const base =
      locale === defaultLocale
        ? pathname
        : `/${supportedBcp47LocaleToPathLocale(locale)}${pathname}`;
    const href = tabId === "content" ? base : `${base}?tab=${tabId}`;

    window.history.replaceState(null, "", href);
  };

  return { handleNavigate };
};

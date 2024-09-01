"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getLocaleDirection } from "@/lib/locale/utils";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "~/i18n.config";
import SidebarContainer from "./sidebar/sidebar-container";

export const ComingSoonAlert = () => {
  const t = useTranslations("reader");
  const locale = useLocale() as AppLocale;

  return (
    <SidebarContainer>
      <Alert
        dir={getLocaleDirection(locale)}
        className="bg-transparent font-sans"
      >
        <AlertTitle>{t("coming-soon.title")}</AlertTitle>
        <AlertDescription>{t("coming-soon.message")}</AlertDescription>
      </Alert>
    </SidebarContainer>
  );
};

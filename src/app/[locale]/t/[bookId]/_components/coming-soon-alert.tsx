"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLocaleDirection } from "@/lib/locale/utils";
import { useLocale, useTranslations } from "next-intl";

import SidebarContainer from "./sidebar/sidebar-container";

export const ComingSoonAlert = () => {
  const t = useTranslations("reader");
  const locale = useLocale();

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

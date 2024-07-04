"use client";

import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "~/i18n.config";
import SidebarContainer from "./sidebar/sidebar-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLocaleDirection } from "@/lib/locale/utils";
import type { TabProps, tabs } from "./sidebar/tabs";
import dynamic from "next/dynamic";
import Spinner from "@/components/ui/spinner";

const supportedBooks = [
  "fath-bari",
  "sahih", // bukhari
  "ihya-culum-din",
];

const ComingSoonAlert = async () => {
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

const Placeholder = () => (
  <div className="flex h-[200px] w-full items-center justify-center">
    <Spinner className="size-5" />
  </div>
);

const AITab = dynamic(() => import("./ai-tab"), { loading: Placeholder });
const ContentTab = dynamic(() => import("./content-tab"), {
  loading: Placeholder,
});
const SearchTab = dynamic(() => import("./search-tab"), {
  loading: Placeholder,
});

type TabId = (typeof tabs)[number]["id"];
const tabIdToComponent: Record<TabId, any> = {
  ai: AITab,
  search: SearchTab,
  content: ContentTab,
};

export const TabContent = ({
  bookSlug,
  bookResponse,
  versionId,
  tabId,
}: TabProps & {
  tabId: keyof typeof tabIdToComponent;
}) => {
  const isSupported = supportedBooks.includes(bookSlug);

  if (!isSupported) {
    return <ComingSoonAlert />;
  }

  const Content = tabIdToComponent[tabId];
  return (
    <Content
      bookSlug={bookSlug}
      bookResponse={bookResponse}
      versionId={versionId}
    />
  );
};

import type { tabs } from "./_components/sidebar/tabs";

import AITab from "./_components/ai-tab";
import SearchTab from "./_components/search-tab";
import ContentTab from "./_components/content-tab";
import { getTranslations } from "next-intl/server";
import { getLocale } from "@/lib/locale/server";
import SidebarContainer from "./_components/sidebar/sidebar-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLocaleDirection } from "@/lib/locale/utils";

type TabId = (typeof tabs)[number]["id"];
const tabIdToComponent: Record<TabId, any> = {
  ai: AITab,
  search: SearchTab,
  content: ContentTab,
};

const ComingSoonAlert = async () => {
  const t = await getTranslations("reader");
  const locale = await getLocale();

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

const books = [
  { slug: "fath-bari" }, // NEXT
  { slug: "sahih" }, // bukhari
  // { slug: "sunan-3" }, // sunan ibn majah
  { slug: "ihya-culum-din" },
];

export default async function SidebarContent({
  params: { bookId, versionId },
  searchParams: { tab: _tabId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
  searchParams: {
    tab: string;
  };
}) {
  const tabId: TabId = tabIdToComponent[_tabId as TabId]
    ? (_tabId as TabId)
    : ("content" as TabId);
  const Component = tabIdToComponent[tabId];

  if (tabId !== "content" && !books.find((book) => book.slug === bookId)) {
    return <ComingSoonAlert />;
  }

  return <Component bookId={bookId} versionId={versionId} />;
}

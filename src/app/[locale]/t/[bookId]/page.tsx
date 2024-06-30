import type { tabs } from "./_components/sidebar/tabs";

import AITab from "./_components/ai-tab";
import SearchTab from "./_components/search-tab";
import ContentTab from "./_components/content-tab";

type TabId = (typeof tabs)[number]["id"];
const tabIdToComponent: Record<TabId, any> = {
  ai: AITab,
  search: SearchTab,
  content: ContentTab,
};

export default async function SidebarContent({
  params: { bookId, versionId },
  searchParams: { tab: tabId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
  searchParams: {
    tab: string;
  };
}) {
  const Component =
    tabIdToComponent[tabId as TabId] ?? tabIdToComponent.content;

  return <Component bookId={bookId} versionId={versionId} />;
}

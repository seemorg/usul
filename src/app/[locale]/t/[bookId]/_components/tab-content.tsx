"use client";

import type { TabProps } from "./sidebar/tabs";
import { ComingSoonAlert } from "./coming-soon-alert";
import { tabIdToComponent } from "./sidebar/tabs-content";

export const TabContent = ({
  bookSlug,
  bookResponse,
  versionId,
  tabId,
}: TabProps & {
  tabId: keyof typeof tabIdToComponent;
}) => {
  const isSupported = bookResponse.book.flags.aiSupported;

  if (!isSupported && (tabId === "ai" || tabId === "search")) {
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

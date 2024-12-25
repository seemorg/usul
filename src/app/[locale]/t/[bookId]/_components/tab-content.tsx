"use client";

import type { TabProps } from "./sidebar/tabs";
import { ComingSoonAlert } from "./coming-soon-alert";
import { tabIdToComponent } from "./sidebar/tabs-content";
import { useBookDetails } from "../_contexts/book-details.context";

export const TabContent = ({
  tabId,
  ...props
}: TabProps & {
  tabId: keyof typeof tabIdToComponent;
}) => {
  const { bookResponse } = useBookDetails();
  const aiSupported = bookResponse.book.aiSupported;
  const keywordSupported = bookResponse.book.keywordSupported;
  const source = bookResponse.content.source;

  /**
   * 1. If the tab is ai and the book is not ai supported
   * 2. If the tab is search and the book is not keyword supported
   * 3. If the book is not openiti or turath and the tab is ai or search
   */
  if (
    (tabId === "ai" && !aiSupported) ||
    (tabId === "search" && !keywordSupported) ||
    (source !== "openiti" &&
      source !== "turath" &&
      (tabId === "ai" || tabId === "search"))
  ) {
    return <ComingSoonAlert />;
  }

  const Content = tabIdToComponent[tabId];
  return <Content {...props} />;
};

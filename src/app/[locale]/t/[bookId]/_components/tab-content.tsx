"use client";

import type { TabProps } from "./sidebar/tabs";
import { useBookDetails } from "../_contexts/book-details.context";
import { ComingSoonAlert } from "./coming-soon-alert";
import { tabIdToComponent } from "./sidebar/tabs-content";

export const TabContent = ({
  tabId,
  ...props
}: TabProps & {
  tabId: keyof typeof tabIdToComponent;
}) => {
  const { bookResponse } = useBookDetails();
  const aiSupported = bookResponse.book.aiSupported;
  const keywordSupported = bookResponse.book.keywordSupported;

  // If the tab is ai and the book is not ai supported, or
  // If the tab is search and the book is not keyword supported
  if (
    (tabId === "ai" && !aiSupported) ||
    (tabId === "search" && !keywordSupported)
  ) {
    return <ComingSoonAlert />;
  }

  const Content = tabIdToComponent[tabId];
  return <Content {...props} />;
};

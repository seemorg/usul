"use client";

import type { TabProps } from "./sidebar/tabs";
import { ComingSoonAlert } from "./coming-soon-alert";
import { tabIdToComponent } from "./sidebar/tabs-content";

export const TabContent = ({
  tabId,
  ...props
}: TabProps & {
  tabId: keyof typeof tabIdToComponent;
}) => {
  const isSupported = props.bookResponse.book.aiSupported;

  if (
    (props.bookResponse.content.source === "external" || !isSupported) &&
    (tabId === "ai" || tabId === "search")
  ) {
    return <ComingSoonAlert />;
  }

  const Content = tabIdToComponent[tabId];
  return <Content {...props} />;
};

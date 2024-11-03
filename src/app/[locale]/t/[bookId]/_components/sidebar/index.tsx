"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SidebarContainer from "./sidebar-container";
import React from "react";
import { useTranslations } from "next-intl";
import { type TabProps, tabs } from "./tabs";
import { useSearchParams } from "next/navigation";
import { useTabNavigate } from "./useTabNavigate";

import { TabContent } from "../tab-content";

const TabButton = ({
  tab,
  handleNavigate,
  disabled,
}: {
  tab: (typeof tabs)[number];
  handleNavigate: ReturnType<typeof useTabNavigate>["handleNavigate"];
  disabled?: boolean;
}) => {
  const t = useTranslations();

  return (
    <TabsTrigger
      value={tab.id}
      type="button"
      onClick={() => (disabled ? null : handleNavigate(tab.id))}
      className="w-full gap-2"
      disabled={disabled}
    >
      <tab.icon className="size-4" />
      <span className="hidden @sm:inline">{t(tab.label as any)}</span>
    </TabsTrigger>
  );
};

export default function ReaderSidebar({
  bookResponse,
  bookSlug,
  versionId,
  isSinglePage,
}: TabProps) {
  const activeTabId = useSearchParams().get("tab");
  const { handleNavigate } = useTabNavigate();
  const activeTab =
    tabs.find((tab) => tab.id === activeTabId)?.id ?? tabs[0]!.id;

  return (
    <div className="sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-background pb-16 pt-10 @container dark:bg-card sm:pt-4">
      <Tabs value={activeTab}>
        <SidebarContainer className="hidden sm:block">
          <TabsList className="w-full font-sans">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                handleNavigate={handleNavigate}
              />
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">
          {tabs.map((tab) => (
            <TabsContent value={tab.id} key={tab.id}>
              <TabContent
                tabId={tab.id}
                bookSlug={bookSlug}
                versionId={versionId}
                isSinglePage={isSinglePage}
                bookResponse={bookResponse}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

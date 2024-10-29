"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SidebarContainer from "./sidebar-container";
import React from "react";
import { useTranslations } from "next-intl";
import { type TabProps, tabs } from "./tabs";
import { useSearchParams } from "next/navigation";
import { useTabNavigate } from "./useTabNavigate";

import { TabContent } from "../tab-content";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="h-full w-full">
          <TabsTrigger
            value={tab.id}
            type="button"
            onClick={() => (disabled ? null : handleNavigate(tab.id))}
            className="w-full gap-2"
            disabled={disabled}
          >
            <tab.icon className="size-4" />
            <span className="@sm:inline hidden">{t(tab.label as any)}</span>
          </TabsTrigger>
        </span>
      </TooltipTrigger>

      <TooltipContent side="bottom">{t(tab.label as any)}</TooltipContent>
    </Tooltip>
  );
};

export default function ReaderSidebar({
  bookResponse,
  bookSlug,
  versionId,
}: TabProps) {
  const activeTabId = useSearchParams().get("tab");
  const { handleNavigate } = useTabNavigate();
  const activeTab =
    tabs.find((tab) => tab.id === activeTabId)?.id ?? tabs[0]!.id;

  return (
    <div className="@container sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-background pb-16 pt-10 dark:bg-card sm:pt-4">
      <Tabs defaultValue={activeTab}>
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
                bookResponse={bookResponse}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

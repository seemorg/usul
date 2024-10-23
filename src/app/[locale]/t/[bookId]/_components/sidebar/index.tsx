"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import SidebarContainer from "./sidebar-container";
import SidebarWrapper from "./wrapper";
import { useTranslations } from "next-intl";
import { type TabProps, tabs } from "./tabs";
import { useSearchParams } from "next/navigation";
import { useTabNavigate } from "./useTabNavigate";

import { TabContent } from "../tab-content";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

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
      <TabsTrigger
        value={tab.id}
        type="button"
        onClick={() => (disabled ? null : handleNavigate(tab.id))}
        className="w-full py-1.5"
        disabled={disabled}
        asChild
      >
        <TooltipTrigger>
          <tab.icon className="size-5" />
        </TooltipTrigger>
      </TabsTrigger>

      <TooltipContent side="bottom" sideOffset={10}>
        {t(tab.label as any)}
      </TooltipContent>
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
    tabs.find((tab) => tab.id === activeTabId)?.id ?? tabs[tabs.length - 1]!.id;

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarWrapper>
          {/* <div className="absolute bottom-0 left-0 top-0 z-0 w-px bg-border" /> */}
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" /> */}

          <Tabs defaultValue={activeTab}>
            <SidebarContainer className="hidden sm:block">
              <TabsList className="h-10 w-full rounded-b-none font-sans">
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
        </SidebarWrapper>
      </SidebarContent>
    </Sidebar>
  );
}

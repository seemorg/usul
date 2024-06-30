"use client";

// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import SidebarContainer from "./sidebar-container";
import SidebarWrapper from "./wrapper";
import { cn } from "@/lib/utils";
import React from "react";
import { useTranslations } from "next-intl";
import { tabs } from "./tabs";
import { useSearchParams } from "next/navigation";
import { useTabNavigate } from "./useTabNavigate";

// const ComingSoonAlert = async () => {
//   const t = await getTranslations("reader");
//   const locale = await getLocale();

//   return (
//     <SidebarContainer>
//       <Alert
//         dir={getLocaleDirection(locale)}
//         className="bg-transparent font-sans"
//       >
//         <AlertTitle>{t("coming-soon.title")}</AlertTitle>
//         <AlertDescription>{t("coming-soon.message")}</AlertDescription>
//       </Alert>
//     </SidebarContainer>
//   );
// };

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
  children,
}: {
  children: React.ReactNode;
}) {
  const activeTabId = useSearchParams().get("tab");
  const { isPending, handleNavigate } = useTabNavigate();
  const activeTab =
    tabs.find((tab) => tab.id === activeTabId)?.id ?? tabs[tabs.length - 1]!.id;

  return (
    <SidebarWrapper>
      <div className="absolute bottom-0 left-0 top-0 z-0 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" />

      <Tabs value={activeTab}>
        <SidebarContainer className="hidden sm:block">
          <TabsList className="h-10 w-full rounded-b-none font-sans">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                handleNavigate={handleNavigate}
                disabled={isPending}
              />
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">{children}</div>
      </Tabs>
    </SidebarWrapper>
  );
}

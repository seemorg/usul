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
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { tabs } from "./tabs";

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

export default function ReaderSidebar({
  children,
  bookId,
}: {
  children: React.ReactNode;
  bookId: string;
}) {
  const path = usePathname();
  const t = useTranslations();

  const activeTab = tabs.find((tab) => path === tab.href(bookId))?.id;

  return (
    <SidebarWrapper>
      <div className="absolute bottom-0 left-0 top-0 z-0 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" />

      <Tabs value={activeTab}>
        <SidebarContainer className="hidden sm:block">
          <TabsList className="h-10 w-full rounded-b-none font-sans">
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TabsTrigger
                  value={tab.id}
                  className={cn(
                    "w-full py-1.5",
                    tab.id === "ai" &&
                      "border-2 border-primary data-[state=active]:bg-primary data-[state=active]:text-white",
                  )}
                  asChild
                >
                  <Link href={tab.href(bookId)}>
                    <TooltipTrigger>
                      <tab.icon className="h-5 w-5" />
                    </TooltipTrigger>
                  </Link>
                </TabsTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  {t(tab.label as any)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">{children}</div>
      </Tabs>
    </SidebarWrapper>
  );
}

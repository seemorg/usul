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

function AnimatedGradientText({
  children,
  className,
  isActive,
}: {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer [--bg-size:300%]",
        className,
      )}
    >
      <div
        className={cn(
          isActive
            ? "animate-gradient pointer-events-none absolute inset-0 -z-[1] block h-full w-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit]"
            : "animate-gradient pointer-events-none absolute inset-0 block h-full w-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        )}
      />

      {children}
    </div>
  );
}

const SparklesIcon = ({
  className,
  isGradient,
}: {
  className?: string;
  isGradient?: boolean;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(className)}
      fill={!isGradient ? "currentColor" : undefined}
    >
      {isGradient && (
        <defs>
          <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{
                stopColor: "#ffaa40",
              }}
            />
            <stop
              offset="50%"
              style={{
                stopColor: "#9c40ff",
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: "#ffaa40",
              }}
            />
          </linearGradient>
        </defs>
      )}

      <path
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
        fill={isGradient ? "url(#grad1)" : undefined}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

const TabButton = ({
  tab,
  bookId,
}: {
  tab: (typeof tabs)[number];
  bookId: string;
}) => {
  const t = useTranslations();
  const isActive = usePathname().endsWith("/ai");
  const isHighlighted = tab.id === "ai";
  const IconToUse = isHighlighted ? SparklesIcon : tab.icon;

  const icon = (
    <IconToUse
      isGradient={isHighlighted && !isActive}
      className={cn(
        "z-[10] size-5",
        isHighlighted && isActive && "text-white",
        // isHighlighted &&
        //   "animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-padding text-transparent",
      )}
    />
  );

  const link = (
    <Link href={tab.href(bookId)} className="z-[1]">
      <TooltipTrigger>{isHighlighted ? icon : icon}</TooltipTrigger>
    </Link>
  );

  const trigger = (
    <TabsTrigger value={tab.id} className={cn("w-full py-1.5")} asChild>
      {isHighlighted ? (
        <AnimatedGradientText isActive={isActive}>{link}</AnimatedGradientText>
      ) : (
        link
      )}
    </TabsTrigger>
  );

  return (
    <Tooltip>
      {trigger}

      <TooltipContent side="bottom" sideOffset={10}>
        {t(tab.label as any)}
      </TooltipContent>
    </Tooltip>
  );
};

export default function ReaderSidebar({
  children,
  bookId,
}: {
  children: React.ReactNode;
  bookId: string;
}) {
  const path = usePathname();
  const activeTab = tabs.find((tab) => path === tab.href(bookId))?.id;

  return (
    <SidebarWrapper>
      <div className="absolute bottom-0 left-0 top-0 z-0 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" />

      <Tabs value={activeTab}>
        <SidebarContainer className="hidden sm:block">
          <TabsList className="h-10 w-full rounded-b-none font-sans">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} bookId={bookId} />
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">{children}</div>
      </Tabs>
    </SidebarWrapper>
  );
}

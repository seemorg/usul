"use client";

import { usePathname } from "@/navigation";
import config, { type AppLocale } from "~/i18n.config";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProgressBar from "@/components/app-progressbar";
import { DirectionProvider } from "@radix-ui/react-direction";
import { getLocaleDirection } from "@/lib/locale/utils";
import { getSharedConfig } from "@/i18n";
import { useMemo } from "react";
import { TotalEntitiesProvider } from "@/contexts/total-entities.context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function Providers({
  children,
  locale,
  messages,
  total,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  total: {
    books: number;
    authors: number;
    regions: number;
    genres: number;
  };
}) {
  const pathname = usePathname();

  const messagesInNamespace = useMemo(() => {
    const namespaces = ["*"];

    const path = pathname as keyof typeof config.namespacedRoutes;
    if (config.namespacedRoutes[path]) {
      namespaces.push(path);
    }

    // if we're on /t/[slug] page, we need to match /t/*
    if (pathname.startsWith("/t/")) {
      namespaces.push("/t/*");
    }

    const filesInNamespace = namespaces.flatMap(
      (namespace) => config.namespacedRoutes[namespace as typeof path] ?? [],
    );

    return filesInNamespace.reduce(
      (acc, fileName) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc = {
          ...acc,
          [fileName]:
            (messages as Record<string, Record<string, string>>)[fileName] ??
            {},
        };

        return acc;
      },
      {} as Record<string, Record<string, string>>,
    ) as AbstractIntlMessages;
  }, [pathname, messages]);

  const dir = getLocaleDirection(locale as AppLocale);

  return (
    <NextIntlClientProvider
      messages={messagesInNamespace}
      locale={locale as AppLocale}
      {...getSharedConfig()}
    >
      <TotalEntitiesProvider value={total}>
        <DirectionProvider dir={dir}>
          <AppProgressBar
            height="4px"
            color="#fff"
            options={{ showSpinner: false }}
            shallowRouting
          />

          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>{children}</TooltipProvider>
            </QueryClientProvider>
          </NextThemesProvider>
        </DirectionProvider>
      </TotalEntitiesProvider>
    </NextIntlClientProvider>
  );
}

export default Providers;

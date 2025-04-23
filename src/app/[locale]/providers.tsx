"use client";

import { type Locale, NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProgressBar from "@/components/app-progressbar";
import { DirectionProvider } from "@radix-ui/react-direction";
import { getLocaleDirection } from "@/lib/locale/utils";

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
  total,
}: {
  children: React.ReactNode;
  locale: Locale;
  total: {
    books: number;
    authors: number;
    regions: number;
    genres: number;
  };
}) {
  const dir = getLocaleDirection(locale);

  return (
    <NextIntlClientProvider>
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

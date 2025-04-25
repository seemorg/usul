"use client";

import type { Locale } from "next-intl";
import AppProgressBar from "@/components/app-progressbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TotalEntitiesProvider } from "@/contexts/total-entities.context";
import { getLocaleDirection } from "@/lib/locale/utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import MobileSearch from "../_components/navbar/mobile-search";

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
            <TooltipProvider>
              {children}

              <MobileSearch />
            </TooltipProvider>
          </QueryClientProvider>
        </NextThemesProvider>
      </DirectionProvider>
    </TotalEntitiesProvider>
  );
}

export default Providers;

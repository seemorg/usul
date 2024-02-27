"use client";

import { usePathname } from "@/navigation";
import config from "~/i18n.config";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProgressBar from "@/components/app-progressbar";

const queryClient = new QueryClient();

function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const pathname = usePathname();

  const namespaces = config.namespacedRoutes["*"].concat(
    config.namespacedRoutes[pathname as keyof typeof config.namespacedRoutes] ??
      [],
  );

  const messagesInNamespace = namespaces.reduce(
    (acc, namespace) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      acc = {
        ...acc,
        ...(messages as Record<string, Record<string, string>>)[namespace],
      };

      return acc;
    },
    {} as Record<string, string>,
  ) as AbstractIntlMessages;

  return (
    <NextIntlClientProvider messages={messagesInNamespace} locale={locale}>
      <AppProgressBar
        height="4px"
        color="#fff"
        options={{ showSpinner: false }}
        shallowRouting
      />

      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </NextIntlClientProvider>
  );
}

export default Providers;

import { cn } from "@/lib/utils";

import "@/styles/globals.css";

import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";
import { getLocaleDirection } from "@/lib/locale/utils";
import type { AppLocale } from "~/i18n.config";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import DemoModalProvider from "../_components/video-modal/provider";
import Analytics from "./analytics";
import { getLocale } from "@/lib/locale/server";

export async function generateMetadata() {
  const locale = await getLocale();
  return getMetadata({
    all: true,
    locale,
  });
}

export const viewport = getViewport();

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale as AppLocale)}
      className="bg-muted-primary"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "relative min-h-screen w-full bg-background font-sans antialiased",
          getFontsClassnames(),
        )}
      >
        <Providers locale={locale} messages={messages}>
          {children}

          <Toaster />
          <DemoModalProvider />
        </Providers>

        {env.VERCEL_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}

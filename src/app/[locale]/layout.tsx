import { cn } from "@/lib/utils";

import "@/styles/globals.css";

import Providers from "./providers";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";
import { getLocaleDirection } from "@/lib/locale/utils";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import DemoModalProvider from "../_components/video-modal";
import Analytics from "./analytics";

import { getTotalEntities } from "@/lib/api";
import type { Locale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    all: true,
    locale,
  });
}

export const viewport = getViewport();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const total = await getTotalEntities();

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      className="bg-muted-primary"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "relative min-h-screen w-full bg-background font-sans antialiased",
          getFontsClassnames(),
        )}
      >
        <NextIntlClientProvider>
          <Providers locale={locale} total={total}>
            {children}

            <Toaster />
            <DemoModalProvider />
          </Providers>
        </NextIntlClientProvider>

        {env.VERCEL_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}

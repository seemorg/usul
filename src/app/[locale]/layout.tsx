import { cn } from "@/lib/utils";

import "@/styles/globals.css";

import type { Locale } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { getTotalEntities } from "@/lib/api";
import { getFontsClassnames } from "@/lib/fonts";
import { getLocaleDirection } from "@/lib/locale/utils";
import { getMetadata, getViewport } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";

import DemoModalProvider from "../_components/video-modal";
import Analytics from "./analytics";
import Providers from "./providers";

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
          "bg-background relative min-h-svh w-full font-sans antialiased",
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

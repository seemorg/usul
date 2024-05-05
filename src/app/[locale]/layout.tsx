import { cn } from "@/lib/utils";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import "@/styles/globals.css";

import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";
import { getLocaleDirection } from "@/lib/locale/utils";
import { locales, type AppLocale } from "~/i18n.config";
import type { LocalePageParams } from "@/types/localization";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: LocalePageParams) {
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
} & LocalePageParams) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale as AppLocale)}
      className="bg-primary"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "relative min-h-screen w-full bg-background font-sans",
          getFontsClassnames(),
        )}
      >
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>

        <GoogleAnalytics gaId="G-QX48J9BW3C" />
        <GoogleTagManager gtmId="AW-16482232385" />
      </body>
    </html>
  );
}

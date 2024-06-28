import { cn } from "@/lib/utils";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import "@/styles/globals.css";

import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";
import { getLocaleDirection } from "@/lib/locale/utils";
import type { AppLocale } from "~/i18n.config";

export function generateMetadata() {
  return getMetadata({
    all: true,
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

        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleAnalytics gaId="G-QX48J9BW3C" />
            <GoogleTagManager gtmId="AW-16482232385" />
          </>
        )}
      </body>
    </html>
  );
}

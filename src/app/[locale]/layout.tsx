import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/styles/globals.css";

import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";
import { getLocaleDirection } from "@/lib/locale/utils";
import type { AppLocale } from "~/i18n.config";

export const metadata = getMetadata({
  all: true,
});
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

        <GoogleAnalytics gaId="G-QX48J9BW3C" />
      </body>
    </html>
  );
}

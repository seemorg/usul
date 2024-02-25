import { cn } from "@/lib/utils";

import "@/styles/globals.css";
import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";
import { getMetadata, getViewport } from "@/lib/seo";

export const metadata = getMetadata();
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
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={cn("font-sans", getFontsClassnames())}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

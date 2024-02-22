import { cn } from "@/lib/utils";

import "@/styles/globals.css";
import Providers from "./providers";
import { useMessages } from "next-intl";
import { getFontsClassnames } from "@/lib/fonts";

export const metadata = {
  title: "The Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={cn("font-sans", getFontsClassnames())}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

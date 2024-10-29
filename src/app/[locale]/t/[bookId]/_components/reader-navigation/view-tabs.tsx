"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function ViewTabs({ hasPdf }: { hasPdf?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("reader");
  const view = searchParams.get("view");
  const router = useRouter();

  const onViewClick = (clickedView: "pdf" | "ebook") => {
    if (clickedView === view) return;

    const newParams = new URLSearchParams(searchParams);
    if (clickedView === "ebook") {
      newParams.delete("view");
    } else {
      newParams.set("view", "pdf");
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Tabs
      defaultValue="ebook"
      value={view === "pdf" ? "pdf" : "ebook"}
      onValueChange={onViewClick as any}
    >
      <TabsList>
        <TabsTrigger value="ebook">{t("e-book")}</TabsTrigger>
        <TabsTrigger value="pdf" disabled={!hasPdf}>
          {t("pdf")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

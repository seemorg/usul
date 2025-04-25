import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

import { useReaderView } from "./utils";

export default function ViewTabs() {
  const t = useTranslations();
  const { view, setView, hasEbook, hasPdf } = useReaderView();

  return (
    <Tabs
      value={view}
      onValueChange={setView as any}
      className="hidden md:inline-flex"
    >
      <TabsList>
        <TabsTrigger
          value="ebook"
          className="disabled:opacity-40"
          disabled={!hasEbook}
          tooltip={!hasEbook ? t("reader.not-available") : undefined}
          tooltipProps={{ side: "bottom" }}
        >
          {t("common.e-book")}
        </TabsTrigger>

        <TabsTrigger
          value="pdf"
          disabled={!hasPdf}
          className="disabled:opacity-40"
          tooltip={!hasPdf ? t("reader.not-available") : undefined}
          tooltipProps={{ side: "bottom" }}
        >
          {t("common.pdf")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useReaderView } from "./utils";
import type { ApiBookResponse } from "@/types/api/book";

export default function ViewTabs({
  hasPdf,
  contentSource,
}: {
  hasPdf: boolean;
  contentSource: ApiBookResponse["content"]["source"];
}) {
  const t = useTranslations();
  const { view, setView } = useReaderView();
  const isPdfSource = contentSource === "pdf";

  return (
    <Tabs
      value={isPdfSource || view === "pdf" ? "pdf" : "ebook"}
      onValueChange={setView as any}
      className="hidden md:inline-flex"
    >
      <TabsList>
        <TabsTrigger
          value="ebook"
          className="disabled:opacity-40"
          disabled={isPdfSource}
          tooltip={isPdfSource ? t("reader.not-available") : undefined}
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

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
          disabled={isPdfSource}
          className="disabled:opacity-40"
        >
          {t("common.e-book")}
        </TabsTrigger>

        <TabsTrigger
          value="pdf"
          disabled={!hasPdf}
          className="disabled:opacity-40"
        >
          {t("common.pdf")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

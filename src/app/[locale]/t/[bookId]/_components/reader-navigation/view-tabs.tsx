import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useReaderView } from "./utils";

export default function ViewTabs({ hasPdf }: { hasPdf?: boolean }) {
  const t = useTranslations("reader");
  const { view, setView } = useReaderView();

  return (
    <Tabs
      defaultValue="ebook"
      value={view === "pdf" ? "pdf" : "ebook"}
      onValueChange={setView as any}
      className="hidden md:inline-flex"
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

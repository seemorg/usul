import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

import type { UsePageNavigationReturnType } from "../usePageNavigation";
import { useReaderVirtuoso } from "../context";
import { useMobileReaderStore } from "@/stores/mobile-reader";

function PageNavigator({
  popover = true,
  range,
  getVirtuosoScrollProps,
}: {
  popover?: boolean;
  range: { start: number; end: number };
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
}) {
  const virtuosoRef = useReaderVirtuoso();
  const closeMobileSidebar = useMobileReaderStore((s) => s.closeMobileSidebar);
  const t = useTranslations("reader.page-navigator");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumber = Number(
      (e.currentTarget.elements.namedItem("pageNumber") as HTMLInputElement)
        .value,
    );

    if (pageNumber < range.start || pageNumber > range.end) {
      // TODO: show an error message
      return;
    }

    const props = getVirtuosoScrollProps(pageNumber - 1);
    virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });

    closeMobileSidebar();
  };

  const Content = (
    <>
      <h4 className="leading-none font-medium">{t("title")}</h4>
      <p className="text-muted-foreground mt-2 text-sm">
        {t("description", { start: range.start, end: range.end })}
      </p>

      <div className="mt-4 grid gap-2">
        <form
          className="grid grid-cols-3 items-center gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            id="pageNumber"
            name="pageNumber"
            type="number"
            placeholder={t("input-placeholder")}
            className="col-span-2 h-9"
          />

          <Button>{t("go")}</Button>
        </form>
      </div>
    </>
  );

  if (!popover) {
    return Content;
  }

  return (
    <div>
      <Label htmlFor="pageNumber" className="text-sm">
        {t("name")}
      </Label>
      <p className="text-muted-foreground mt-1 text-xs">
        {t("description", { start: range.start, end: range.end })}
      </p>

      <form
        className="mt-3 grid grid-cols-3 items-center"
        onSubmit={handleSubmit}
      >
        <Input
          id="pageNumber"
          name="pageNumber"
          type="number"
          placeholder={t("input-placeholder")}
          className="bg-background col-span-2 h-9 ltr:rounded-r-none rtl:rounded-l-none"
        />

        <Button className="ltr:rounded-l-none rtl:rounded-r-none">
          {t("go")}
        </Button>
      </form>
    </div>
  );
}

export default PageNavigator;

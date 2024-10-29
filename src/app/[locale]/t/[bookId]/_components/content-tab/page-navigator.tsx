import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReaderVirtuoso } from "../context";
import { useTranslations } from "next-intl";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import { Label } from "@/components/ui/label";

function PageNavigator({
  popover = true,
  range,
  getVirtuosoIndex,
}: {
  popover?: boolean;
  range: { start: number; end: number };
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
}) {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();
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

    const props = getVirtuosoIndex(pageNumber);
    virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  const Content = (
    <>
      <h4 className="font-medium leading-none">{t("title")}</h4>
      <p className="mt-2 text-sm text-muted-foreground">
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
      <p className="mt-1 text-xs text-muted-foreground">
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
          className="col-span-2 h-9 bg-background ltr:rounded-r-none rtl:rounded-l-none"
        />

        <Button className="ltr:rounded-l-none rtl:rounded-r-none">
          {t("go")}
        </Button>
      </form>
    </div>
  );
}

export default PageNavigator;

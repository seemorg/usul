"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReaderVirtuoso } from "../context";
import { useTranslations } from "next-intl";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import type { UsePageNavigationReturnType } from "../usePageNavigation";

export default function PageNavigator({
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

    virtuosoRef.current?.scrollToIndex(getVirtuosoIndex(pageNumber));

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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 font-normal text-primary hover:text-primary"
        >
          {t("name")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 max-w-full py-5">
        {Content}
      </PopoverContent>
    </Popover>
  );
}

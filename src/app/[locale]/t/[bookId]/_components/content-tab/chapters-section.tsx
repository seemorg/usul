"use client";

import type {
  OpenitiBookResponse,
  TurathBookResponse,
} from "@/server/services/books";
import { useReaderVirtuoso } from "../context";
import PageNavigator from "./page-navigator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormatter } from "next-intl";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import React from "react";
import type { UsePageNavigationReturnType } from "../usePageNavigation";

export default function ChaptersList({
  headers,
  chapterIndexToPageIndex,
  getVirtuosoIndex,
  pagesRange,
}: {
  headers:
    | TurathBookResponse["turathResponse"]["headings"]
    | OpenitiBookResponse["chapters"];
  chapterIndexToPageIndex?:
    | TurathBookResponse["chapterIndexToPageIndex"]
    | null;
  pagesRange: UsePageNavigationReturnType["pagesRange"];
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
}) {
  const virtuosoRef = useReaderVirtuoso();
  const formatter = useFormatter();
  const mobileSidebar = useMobileSidebar();

  const handleNavigate = (
    chapterIndex: number,
    pageNumber: number | { vol: string; page: number } | string,
  ) => {
    if (typeof pageNumber === "string") return;

    const idx = chapterIndexToPageIndex?.[chapterIndex] ?? -1;
    virtuosoRef.current?.scrollToIndex(
      idx !== -1 ? idx : getVirtuosoIndex(pageNumber),
    );

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  if (headers.length === 0) {
    return (
      <div className="mt-5">
        <PageNavigator
          popover={false}
          range={pagesRange}
          getVirtuosoIndex={getVirtuosoIndex}
        />
      </div>
    );
  }

  return (
    <div
      className="flex w-full flex-col gap-3"
      // ref={(el) => {
      //   setParentRef(el);
      // }}
    >
      {/* <Virtuoso
        className="w-full"
        customScrollParent={parentRef ?? undefined}
        totalCount={headers.length}
        overscan={5}
        initialItemCount={20}
        components={{
          // eslint-disable-next-line react/display-name
          List: React.forwardRef((props, ref) => (
            <div {...props} ref={ref} className="flex flex-col gap-3" />
          )),
        }}
        itemContent={(idx) => {
          const chapter = headers[idx]!;
         

          
        }}
      /> */}

      {headers.map((chapter, idx) => {
        const page =
          typeof chapter.page === "number" ? chapter.page : chapter?.page?.page;
        const volume =
          "volume" in chapter ? chapter.volume : (chapter?.page as any)?.vol;
        const title = chapter.title;

        return (
          <Button
            key={idx}
            variant="link"
            className={cn(
              "h-auto w-full items-center justify-start gap-5 px-0 text-lg font-normal hover:no-underline",
              idx !== 0 && "text-foreground hover:text-foreground/75",
            )}
            dir="rtl"
            onClick={() => {
              if (page) {
                handleNavigate(idx, page);
              }
            }}
          >
            {page && (
              <span className="text-xs">
                {typeof page === "string" || typeof page === "number"
                  ? formatter.number(Number(page))
                  : `${volume} / ${page}`}
              </span>
            )}

            <p
              className="block min-w-0 flex-wrap text-wrap text-start leading-5"
              dir="rtl"
            >
              {title}
            </p>
          </Button>
        );
      })}
    </div>
  );
}

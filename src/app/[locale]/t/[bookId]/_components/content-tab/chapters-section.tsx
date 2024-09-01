"use client";

import type { fetchBook } from "@/server/services/books";
import { useReaderVirtuoso } from "../context";
import PageNavigator from "./page-navigator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormatter } from "next-intl";
import { useMobileSidebar } from "../mobile-sidebar-provider";
// import { Virtuoso } from "react-virtuoso";
import React from "react";

type ResponseType = Awaited<ReturnType<typeof fetchBook>>;

export default function ChaptersList({
  headers,
  pagesRange,
  pageToIndex,
  chapterIndexToPageIndex,
}: {
  headers:
    | NonNullable<ResponseType["headers"]>
    | NonNullable<ResponseType["turathResponse"]>["indexes"]["headings"];
  chapterIndexToPageIndex: ResponseType["chapterIndexToPageIndex"];
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
}) {
  const virtuosoRef = useReaderVirtuoso();
  const formatter = useFormatter();
  const mobileSidebar = useMobileSidebar();

  const handleNavigate = (chapterIndex: number, pageNumber: number) => {
    virtuosoRef.current?.scrollToIndex({
      index: chapterIndexToPageIndex
        ? chapterIndexToPageIndex[chapterIndex] ?? 0
        : pageNumber - pagesRange.start,
      align: "center",
    });

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  if (headers.length === 0) {
    return (
      <div className="mt-5">
        <PageNavigator
          range={pagesRange}
          popover={false}
          pageToIndex={pageToIndex}
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
        const page = "level" in chapter ? chapter.page : chapter?.page?.page;
        const title = "title" in chapter ? chapter.title : chapter.content;

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
              if (page && typeof page === "number") {
                handleNavigate(idx, page);
              }
            }}
          >
            {chapter.page && (
              <span className="text-xs">
                {typeof page === "number" ? formatter.number(page) : page}
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

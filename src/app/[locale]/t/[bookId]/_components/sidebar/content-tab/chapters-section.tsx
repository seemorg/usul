"use client";

import type { fetchBook } from "@/server/services/books";
import { useReaderVirtuoso } from "../../context";
import PageNavigator from "./page-navigator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormatter } from "next-intl";

export default function ChaptersList({
  headers,
  pagesRange,
}: {
  headers: Awaited<ReturnType<typeof fetchBook>>["headers"];
  pagesRange: { start: number; end: number };
}) {
  const virtuosoRef = useReaderVirtuoso();
  const formatter = useFormatter();

  const handleNavigate = (pageNumber: number) => {
    virtuosoRef.current?.scrollToIndex({
      index: pageNumber - pagesRange.start,
      align: "center",
    });
  };

  if (headers.length === 0) {
    return (
      <div className="mt-5">
        <PageNavigator range={pagesRange} popover={false} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {headers.map((chapter, idx) => (
        <Button
          key={idx}
          variant="link"
          className={cn(
            "h-auto w-full items-center justify-between gap-5 px-0 text-lg font-normal hover:no-underline",
            idx !== 0 && "text-foreground hover:text-foreground/75",
          )}
          onClick={() => {
            if (chapter.page && typeof chapter.page.page === "number") {
              handleNavigate(chapter.page.page);
            }
          }}
        >
          {chapter.page && (
            <span className="text-xs">
              {typeof chapter.page.page === "number"
                ? formatter.number(chapter.page.page)
                : chapter.page.page}
            </span>
          )}

          <p
            className="block min-w-0 flex-wrap text-wrap text-start leading-5"
            dir="rtl"
          >
            {chapter.content}
          </p>
        </Button>
      ))}
    </div>
  );
}

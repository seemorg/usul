"use client";

import { Virtualizer } from "virtua";

import { memo, useMemo, useRef } from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "../context";
import Footer from "@/app/_components/footer";
import ReaderPage from "./reader-page";
import { READER_OVERSCAN_SIZE, READER_SSR_SIZE } from "@/lib/constants";
import Container from "@/components/ui/container";
import Paginator from "../../[pageNumber]/paginator";
import { HighlightPopover } from "@/components/ui/highlight-popover";
import ReaderHighlightPopover from "./highlight-popover";
import { useBookDetails } from "../../_contexts/book-details.context";
import BookInfo from "./book-info";
import { Separator } from "@/components/ui/separator";
import type { DefaultPages } from "./use-fetch-page";

export default function ReaderContent({
  isSinglePage,
  currentPage,
}: {
  isSinglePage?: boolean;
  currentPage?: number;
}) {
  const { bookResponse } = useBookDetails();
  const content = bookResponse.content as Exclude<
    typeof bookResponse.content,
    { source: "external" }
  >;

  const virtuosoRef = useReaderVirtuoso();
  const setContainerEl = useSetReaderScroller();
  const containerEl = useRef<HTMLElement>(null);

  const defaultPages = useMemo(() => {
    if (content.source === "turath") {
      return content.pages;
    } else if (content.source === "openiti") {
      return content.pages;
    } else if (content.source === "pdf" && content.pages) {
      return content.pages;
    }

    return [];
  }, [content]);

  return (
    <div
      className="text-foreground relative h-screen! w-full overflow-y-auto text-xl [overflow-anchor:none]"
      dir="rtl"
      ref={(r) => {
        if (r) {
          setContainerEl({ element: r });
          containerEl.current = r;
        }
      }}
    >
      {isSinglePage && (
        <Paginator
          totalPages={bookResponse.pagination.total}
          currentPage={currentPage!}
          slug={bookResponse.book.slug}
        />
      )}

      <div className="w-full px-5 lg:px-8">
        <BookInfo className="mx-auto max-w-5xl py-8" />

        <Separator />
      </div>

      <Virtualizer
        count={isSinglePage ? 1 : bookResponse.pagination.total}
        ssrCount={
          isSinglePage ? 1 : Math.min(defaultPages.length, READER_SSR_SIZE)
        }
        overscan={READER_OVERSCAN_SIZE}
        ref={virtuosoRef}
        startMargin={80}

        // as={forwardRef((props, ref) => (
        //   <div
        //     className="min-h-[100vh] w-full flex-auto divide-y-2 divide-border"
        //     ref={ref}
        //     {...props}
        //   />
        // ))}
      >
        {new Array(isSinglePage ? 1 : bookResponse.pagination.total)
          .fill(null)
          .map((_, index) => (
            <Page
              key={index}
              index={isSinglePage ? currentPage! - 1 : index}
              defaultPages={defaultPages}
              perPage={bookResponse.pagination.size}
              source={content.source}
            />
          ))}
      </Virtualizer>

      <div className="mx-auto mt-10 w-full max-w-[90%]">
        <Footer />
      </div>
    </div>
  );
}

const Page = memo(
  ({
    index,
    defaultPages,
    perPage,
    source,
  }: {
    index: number;
    defaultPages: DefaultPages;
    perPage: number;
    source: "turath" | "openiti" | "pdf";
  }) => {
    return (
      <Container className="border-border font-scheherazade mx-auto flex flex-col gap-8 border-b-2 px-5 pt-7 pb-5 lg:px-8 xl:px-16 2xl:max-w-5xl">
        <HighlightPopover
          renderPopover={({ selection }) => (
            <ReaderHighlightPopover selection={selection} pageIndex={index} />
          )}
          offset={{ x: 0, y: 100 }}
        >
          <ReaderPage
            source={source}
            index={index}
            defaultPages={defaultPages}
            perPage={perPage}
          />
        </HighlightPopover>
      </Container>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.index === nextProps.index;
  },
);

Page.displayName = "Page";

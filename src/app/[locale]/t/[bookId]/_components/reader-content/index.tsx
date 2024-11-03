"use client";

import { Virtualizer } from "virtua";

import React, { forwardRef, memo, useMemo, useRef } from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "../context";
import Footer from "@/app/_components/footer";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import ReaderPage from "./reader-page";
import { READER_OVERSCAN_SIZE, READER_PAGINATION_SIZE } from "@/lib/constants";
import Container from "@/components/ui/container";
import Paginator from "../../[pageNumber]/paginator";
import { HighlightPopover } from "@/components/ui/highlight-popover";
import ReaderHighlightPopover from "./highlight-popover";

export default function ReaderContent({
  response,
  isSinglePage,
  currentPage,
}: {
  response: ApiBookResponse;
  isSinglePage?: boolean;
  currentPage?: number;
}) {
  const virtuosoRef = useReaderVirtuoso();
  const setContainerEl = useSetReaderScroller();
  const containerEl = useRef<HTMLElement>(null);

  const defaultPages = useMemo(() => {
    if (response.content.source === "turath") {
      return response.content.pages;
    } else if (response.content.source === "openiti") {
      return response.content.pages;
    } else {
      return [];
    }
  }, [response]);

  return (
    <div
      className="relative !h-screen w-full overflow-y-auto text-xl text-foreground [overflow-anchor:none]"
      dir="rtl"
      ref={(r) => {
        if (r) {
          setContainerEl({ element: r });
          // @ts-ignore
          containerEl.current = r;
        }
      }}
    >
      {isSinglePage && (
        <Paginator
          totalPages={response.pagination.total}
          currentPage={currentPage!}
          slug={response.book.slug}
        />
      )}

      <Virtualizer
        count={isSinglePage ? 1 : response.pagination.total}
        ssrCount={
          isSinglePage
            ? 1
            : Math.min(defaultPages.length, READER_PAGINATION_SIZE)
        }
        overscan={READER_OVERSCAN_SIZE}
        ref={virtuosoRef}
        startMargin={80}
        // eslint-disable-next-line react/display-name
        as={forwardRef((props, ref) => (
          <div
            className="min-h-[100vh] w-full flex-auto divide-y-2 divide-border"
            ref={ref}
            {...props}
          />
        ))}
      >
        {new Array(isSinglePage ? 1 : response.pagination.total)
          .fill(null)
          .map((_, index) => (
            <Page
              key={index}
              index={isSinglePage ? currentPage! - 1 : index}
              defaultPages={defaultPages}
              perPage={response.pagination.size}
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
  }: {
    index: number;
    defaultPages: any[];
    perPage: number;
  }) => {
    return (
      <Container className="mx-auto flex flex-col gap-8 px-5 pb-5 pt-7 font-scheherazade lg:px-8 xl:px-16 2xl:max-w-5xl">
        <HighlightPopover
          renderPopover={({ selection }) => (
            <ReaderHighlightPopover selection={selection} pageIndex={index} />
          )}
          offset={{ x: 0, y: 100 }}
        >
          <ReaderPage
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

"use client";

import { Virtualizer } from "virtua";

import React, { forwardRef, memo, useMemo, useRef } from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "../context";
import Footer from "@/app/_components/footer";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import ReaderPage from "./reader-page";
import { READER_OVERSCAN_SIZE, READER_PAGINATION_SIZE } from "@/lib/constants";
import Container from "@/components/ui/container";
import BookInfoHeader from "./book-info-header";

export default function ReaderContent({
  response,
}: {
  response: ApiBookResponse;
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
      className="!h-screen w-full overflow-y-auto bg-background text-xl text-foreground [overflow-anchor:none]"
      dir="rtl"
      ref={(r) => {
        if (r) {
          setContainerEl({ element: r });
          // @ts-ignore
          containerEl.current = r;
        }
      }}
    >
      <div className="h-[30px] w-full" />

      <BookInfoHeader bookResponse={response} />

      <Virtualizer
        count={response.pagination.total}
        ssrCount={Math.min(defaultPages.length, READER_PAGINATION_SIZE)}
        overscan={READER_OVERSCAN_SIZE}
        ref={virtuosoRef}
        startMargin={80}
        // eslint-disable-next-line react/display-name
        as={forwardRef((props, ref) => (
          <div
            className="w-full flex-auto divide-y-2 divide-border"
            ref={ref}
            {...props}
          />
        ))}
      >
        {new Array(response.pagination.total).fill(null).map((_, index) => (
          <Page
            key={index}
            index={index}
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

// eslint-disable-next-line react/display-name
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
      <Container className="mx-auto flex flex-col gap-8 px-5 pb-5 pt-7 font-amiri lg:px-8 xl:px-16 2xl:max-w-5xl">
        <ReaderPage
          index={index}
          defaultPages={defaultPages}
          perPage={perPage}
        />
      </Container>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.index === nextProps.index;
  },
);

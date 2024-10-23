"use client";

import { WindowVirtualizer } from "virtua";

import React, { forwardRef, memo, useMemo } from "react";
import { useReaderVirtuoso } from "../context";
import Footer from "@/app/_components/footer";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import ReaderPage from "./reader-page";
import { READER_OVERSCAN_SIZE, READER_PAGINATION_SIZE } from "@/lib/constants";

export default function ReaderContent({
  response,
}: {
  response: ApiBookResponse;
}) {
  const virtuosoRef = useReaderVirtuoso();

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
    <>
      <div
        className="mx-auto w-full max-w-5xl px-5 text-xl text-foreground lg:!px-8 xl:!px-16"
        dir="rtl"
      >
        <WindowVirtualizer
          count={response.pagination.total}
          ssrCount={Math.min(defaultPages.length, READER_PAGINATION_SIZE)}
          overscan={READER_OVERSCAN_SIZE}
          ref={virtuosoRef}
          // startMargin={80}
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
        </WindowVirtualizer>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[90%]">
        <Footer />
      </div>
    </>
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
      <div className="flex flex-col gap-8 pb-5 pt-14 font-amiri">
        <ReaderPage
          index={index}
          defaultPages={defaultPages}
          perPage={perPage}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.index === nextProps.index;
  },
);

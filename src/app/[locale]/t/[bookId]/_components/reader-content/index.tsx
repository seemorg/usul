"use client";

import { Virtuoso } from "react-virtuoso";
import React, { useMemo } from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "../context";
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
  const setContainerEl = useSetReaderScroller();

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
    <Virtuoso
      className="!h-screen w-full overflow-y-auto bg-background text-xl text-foreground"
      totalCount={response.pagination.total}
      initialItemCount={Math.min(defaultPages.length, READER_PAGINATION_SIZE)}
      overscan={READER_OVERSCAN_SIZE}
      scrollerRef={(ref) => {
        if (ref) {
          // @ts-ignore
          setContainerEl({ element: ref });
        }
      }}
      dir="rtl"
      ref={virtuosoRef}
      components={{
        Header: (props) => <div {...props} className="h-20 w-full" />,
        Footer: (props) => (
          <div className="mx-auto mt-10 w-full max-w-[90%]" {...props}>
            <Footer />
          </div>
        ),
        // eslint-disable-next-line react/display-name
        List: React.forwardRef((props, ref) => (
          <div
            {...props}
            ref={ref}
            className="mx-auto w-full min-w-0 max-w-4xl flex-auto divide-y-2 divide-border px-5 lg:!px-8 xl:!px-16"
          />
        )),
      }}
      itemContent={(index) => (
        <div className="flex flex-col gap-8 pb-5 pt-14 font-amiri">
          <ReaderPage
            index={index}
            defaultPages={defaultPages}
            perPage={response.pagination.size}
          />
        </div>
      )}
    />
  );
}

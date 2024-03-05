"use client";

import RenderBlock from "@/components/render-markdown";
import type { fetchBook } from "@/server/services/books";
import { Virtuoso } from "react-virtuoso";
import React from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "./context";

export default function ReaderContent({
  pages,
}: {
  pages: Awaited<ReturnType<typeof fetchBook>>["pages"];
}) {
  const virtuosoRef = useReaderVirtuoso();
  const setContainerEl = useSetReaderScroller();

  return (
    <Virtuoso
      className="!h-screen w-full overflow-y-auto bg-background text-xl text-foreground"
      totalCount={pages.length}
      initialItemCount={Math.min(pages.length, 5)}
      overscan={5}
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
        Footer: (props) => <div {...props} className="h-10 w-full" />,
        // eslint-disable-next-line react/display-name
        List: React.forwardRef((props, ref) => (
          <div
            {...props}
            ref={ref}
            className="w-full min-w-0 flex-auto divide-y-2 divide-border lg:!pl-0 lg:!pr-8 xl:!px-16"
          />
        )),
      }}
      itemContent={(index) => {
        const { blocks, page } = pages[index]!;

        return (
          <div className="flex flex-col gap-5 pb-5 pt-14">
            {blocks.map((block, blockIndex) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <RenderBlock key={blockIndex} block={block as any} />
            ))}

            <p className="mt-10 text-center text-sm text-muted-foreground">
              {page ? `page ${page.page}` : "unknown page"}
            </p>
          </div>
        );
      }}
    />
  );
}

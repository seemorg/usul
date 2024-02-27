"use client";

import RenderBlock from "@/components/render-markdown";
import type { fetchBook } from "@/lib/book";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export default function ReaderContent({
  pages,
}: {
  pages: Awaited<ReturnType<typeof fetchBook>>["pages"];
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: pages.length,
    getScrollElement: () => parentRef.current,
    // estimateSize: (i) =>
    //   pages[i]!.blocks.reduce((acc, current) => {
    //     return (
    //       acc +
    //       (typeof current.content === "string" ? current.content.length : 2) *
    //         1.5
    //     );
    //   }, 0),
    estimateSize: () => 600,
    overscan: 5,
  });

  return (
    <div
      className="flex min-h-screen flex-col bg-white text-xl text-black"
      dir="rtl"
      ref={parentRef}
    >
      {/* The large inner element to hold all of the items */}
      <div
        className="relative w-full divide-y-2 divide-gray-200"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {/* Only the visible items in the virtualizer, manually positioned to be in view */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const page = pages[virtualItem.index]!;

          return (
            <div
              key={virtualItem.key}
              style={{
                // height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="absolute left-0 top-0 flex w-full flex-col gap-5 pb-5 pt-14"
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
            >
              {page.blocks.map((block, blockIndex) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <RenderBlock key={blockIndex} block={block as any} />
              ))}

              <p className="mt-10 text-center text-sm text-gray-400">
                {page.page?.page ? `page ${page.page.page}` : "unknown page"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

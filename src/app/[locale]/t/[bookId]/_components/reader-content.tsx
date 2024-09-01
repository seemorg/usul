"use client";

import RenderBlock from "@/components/render-markdown";
import type { fetchBook } from "@/server/services/books";
import { Virtuoso } from "react-virtuoso";
import React, { useCallback, type PropsWithChildren } from "react";
import { useReaderVirtuoso, useSetReaderScroller } from "./context";
import Footer from "@/app/_components/footer";
import { useTranslations } from "next-intl";

type ResponseType = Awaited<ReturnType<typeof fetchBook>>;
type Pages =
  | NonNullable<ResponseType["pages"]>
  | NonNullable<ResponseType["turathResponse"]>["pages"];

const PageLabel = (props: PropsWithChildren) => (
  <p
    className="mt-10 text-center font-sans text-sm text-muted-foreground"
    {...props}
  />
);

export default function ReaderContent({ pages }: { pages: Pages }) {
  const virtuosoRef = useReaderVirtuoso();
  const setContainerEl = useSetReaderScroller();
  const t = useTranslations("common");

  const renderContent = useCallback(
    (index: number) => {
      const pageObj = pages[index]!;
      const isTurath = "text" in pageObj;

      if (isTurath) {
        return (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: pageObj.text.replaceAll("</span>.", "</span>"),
              }}
              className="flex flex-col text-2xl leading-[2.3] [&>span:first-child]:mt-0 [&>span]:mx-auto [&>span]:my-10 [&>span]:text-center [&>span]:font-bold"
            />

            <PageLabel>
              {pageObj.page
                ? t("pagination.page-x", { page: pageObj.page })
                : t("pagination.page-unknown")}
            </PageLabel>
          </>
        );
      }

      const { blocks, page } = pageObj;

      return (
        <>
          {blocks.map((block, blockIndex) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            <RenderBlock key={blockIndex} block={block as any} />
          ))}

          <PageLabel>
            {page
              ? typeof page.page === "number"
                ? t("pagination.page-x", { page: page.page })
                : page.page
              : t("pagination.page-unknown")}
          </PageLabel>
        </>
      );
    },
    [pages, t],
  );

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
          {renderContent(index)}
        </div>
      )}
    />
  );
}

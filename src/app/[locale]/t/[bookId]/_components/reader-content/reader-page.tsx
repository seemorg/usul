"use client";

import RenderBlock from "@/components/render-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getBook } from "@/lib/api";
import type { Openiti, Turath } from "@/types/ApiBookResponse";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type PropsWithChildren, useMemo } from "react";

type DefaultPages = NonNullable<Turath["pages"] | Openiti["pages"]>;

const PageLabel = (props: PropsWithChildren) => (
  <p
    className="mt-10 text-center font-sans text-sm text-muted-foreground"
    {...props}
  />
);

export default function ReaderPage({
  index,
  perPage = 10,
  defaultPages,
}: {
  index: number;
  perPage?: number;
  defaultPages: DefaultPages;
}) {
  const t = useTranslations("common");
  const { page, isLoading, isError } = useFetchPage(
    index,
    perPage,
    defaultPages,
  );

  if (isError) {
    return <div>Error loading page</div>;
  }

  if (!page || isLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  const isTurath = "text" in page;

  if (isTurath) {
    return (
      <>
        <div className="flex flex-col" />
        {/* [&_span[data-type='title']:first-child]:mt-0 */}
        <div
          className="text-justify text-2xl leading-[2.3] [&_a]:text-primary [&_a]:underline [&_span[data-type='title']]:mx-auto [&_span[data-type='title']]:mb-12 [&_span[data-type='title']]:mt-28 [&_span[data-type='title']]:block [&_span[data-type='title']]:text-center [&_span[data-type='title']]:text-3xl [&_span[data-type='title']]:font-bold [&_span[data-type='title']]:leading-[2]"
          dangerouslySetInnerHTML={{
            __html: page.text.replaceAll("</span>.", "</span>"),
          }}
        />

        <PageLabel>
          {page.page
            ? `${page.vol} / ${page.page}`
            : t("pagination.page-unknown")}
        </PageLabel>
      </>
    );
  }

  const { blocks, page: pageNumber } = page;

  return (
    <>
      {blocks.map((block, blockIndex) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <RenderBlock key={blockIndex} block={block as any} />
      ))}

      <PageLabel>
        {pageNumber && !isNaN(pageNumber)
          ? t("pagination.page-x", { page: pageNumber })
          : t("pagination.page-unknown")}
      </PageLabel>
    </>
  );
}

const useFetchPage = (
  index: number,
  perPage: number,
  defaultPages: DefaultPages,
) => {
  const slug = useParams().bookId as string;

  const pageInfo = useMemo(() => {
    const page = Math.floor(index / perPage);
    const startIndex = page * perPage;
    const relativeIndex = index - startIndex;

    return {
      page,
      startIndex,
      relativeIndex,
    };
  }, [index, perPage]);

  const shouldUseDefaultPages = pageInfo.startIndex < defaultPages.length;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reader", pageInfo.startIndex],
    queryFn: async ({ queryKey }) => {
      const startIndex = queryKey[1] as number;

      const response = await getBook(slug, {
        startIndex: startIndex,
        size: perPage,
      });

      return (response.content as any).pages as DefaultPages;
    },
    enabled: !shouldUseDefaultPages,
  });

  const defaultPage = shouldUseDefaultPages
    ? defaultPages[pageInfo.relativeIndex]
    : null;
  const page = data ? data[pageInfo.relativeIndex] : defaultPage;

  return {
    page,
    isLoading,
    isError,
  };
};

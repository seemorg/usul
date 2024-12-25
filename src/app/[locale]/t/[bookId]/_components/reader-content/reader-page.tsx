"use client";

import RenderBlock from "@/components/render-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getBook } from "@/lib/api";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { TurathContent } from "@/types/api/content/turath";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { type PropsWithChildren, useMemo } from "react";

type DefaultPages = NonNullable<
  TurathContent["pages"] | OpenitiContent["pages"]
>;

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
          className="text-2xl leading-[45px] [&_a]:text-primary [&_a]:underline [&_span[data-type='title']]:mx-auto [&_span[data-type='title']]:mb-12 [&_span[data-type='title']]:mt-28 [&_span[data-type='title']]:block [&_span[data-type='title']]:text-center [&_span[data-type='title']]:text-3xl [&_span[data-type='title']]:font-bold [&_span[data-type='title']]:leading-[40px]"
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
  const params = useParams();
  const versionId = useSearchParams().get("versionId");
  const slug = params.bookId as string;

  const pageNumber = params.pageNumber as string | undefined;
  const isSinglePage = !!pageNumber;

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
    queryKey: ["reader", slug, versionId, pageInfo.startIndex] as const,
    queryFn: async ({ queryKey }) => {
      const [, _bookSlug, _versionId, startIndex] = queryKey;

      const response = await getBook(_bookSlug, {
        startIndex: startIndex,
        size: perPage,
        versionId: _versionId ?? undefined,
      });

      if (!response || "type" in response) {
        return null;
      }

      return (response.content as any).pages as DefaultPages;
    },
    enabled: !isSinglePage && !shouldUseDefaultPages,
  });

  const defaultPage = isSinglePage
    ? defaultPages[0]
    : shouldUseDefaultPages
      ? defaultPages[pageInfo.relativeIndex]
      : null;

  const page = data ? data[pageInfo.relativeIndex] : defaultPage;

  return {
    page,
    isLoading,
    isError,
  };
};

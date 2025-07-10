import type { ApiBookParams } from "@/types/api/book";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { PdfContent } from "@/types/api/content/pdf";
import type { TurathContent } from "@/types/api/content/turath";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getBook } from "@/lib/api/books";
import { useQuery } from "@tanstack/react-query";

export type DefaultPages = NonNullable<
  | TurathContent["pages"]
  | OpenitiContent["pages"]
  | NonNullable<PdfContent["pages"]>
>;

// Use a plain object for lighter memory usage compared to Map
const alternateSlugsMap: Record<string, string> = {};

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

      const bookParams: ApiBookParams = {
        startIndex: startIndex,
        size: perPage,
        versionId: _versionId ?? undefined,
      };

      const alternateSlug = alternateSlugsMap[_bookSlug];
      let response = await getBook(alternateSlug ?? _bookSlug, bookParams);
      if (!response) return null;

      if ("type" in response) {
        const newAlternateSlug = response.primarySlug;
        alternateSlugsMap[_bookSlug] = newAlternateSlug;
        response = await getBook(newAlternateSlug, bookParams);

        // safety check, should never happen
        if (!response || "type" in response) return null;
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

export default useFetchPage;

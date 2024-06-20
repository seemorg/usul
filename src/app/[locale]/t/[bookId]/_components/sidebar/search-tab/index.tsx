import { getPathLocale } from "@/lib/locale/server";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import SearchTab from "./client";
import { fetchBook } from "@/server/services/books";

interface SearchTabProps {
  bookId: string;
  searchParams: ReaderSearchParams;
}

export default async function _SearchTab({
  bookId,
  searchParams,
}: SearchTabProps) {
  let result: Awaited<ReturnType<typeof fetchBook>>;
  const pathLocale = await getPathLocale();

  try {
    result = await fetchBook(bookId, pathLocale, searchParams?.version);
  } catch (e) {
    return null;
  }

  const firstPage =
    (result.turathResponse
      ? result.turathResponse.pages?.[0]?.page
      : result.pages[0]?.page?.page) ?? 0;
  const lastPage =
    (result.turathResponse
      ? result.turathResponse.pages?.[result.turathResponse.pages.length - 1]
          ?.page
      : result.pages[result.pages.length - 1]?.page?.page) ?? 0;

  const pagesRange = {
    start: typeof firstPage === "number" ? firstPage : 0,
    end: typeof lastPage === "number" ? lastPage : 0,
  };
  const pageToIndex = result.pageToRenderIndex;

  return (
    <SearchTab
      bookSlug={bookId}
      pagesRange={pagesRange}
      pageToIndex={pageToIndex}
    />
  );
}

import { fetchBook } from "@/server/services/books";
import { getPathLocale } from "@/lib/locale/server";
import _SearchTab from "./client";

export default async function SearchTab({
  bookId,
  versionId,
}: {
  bookId: string;
  versionId?: string;
}) {
  let result: Awaited<ReturnType<typeof fetchBook>>;
  const pathLocale = await getPathLocale();

  try {
    result = await fetchBook(bookId, pathLocale, versionId);
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
    <_SearchTab
      bookSlug={bookId}
      pagesRange={pagesRange}
      pageToIndex={pageToIndex}
    />
  );
}

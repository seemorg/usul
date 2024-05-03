import { fetchBook } from "@/server/services/books";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import { getMetadata } from "@/lib/seo";
import { getPathLocale } from "@/lib/locale/server";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { navigation } from "@/lib/urls";

export const generateMetadata = async ({
  params: { bookId },
}: {
  params: {
    bookId: string;
  };
}) => {
  const pathLocale = await getPathLocale();
  const book = await fetchBook(bookId, pathLocale);

  if (!book) return {};

  const name = getPrimaryLocalizedText(
    book.book.primaryNameTranslations,
    pathLocale,
  );

  return getMetadata({
    title: name,
    pagePath: navigation.books.reader(bookId),
  });
};

export default async function ReaderPage({
  params: { bookId },
  searchParams,
}: {
  params: {
    bookId: string;
  };
  searchParams: ReaderSearchParams;
}) {
  const pathLocale = await getPathLocale();

  let pages: Awaited<ReturnType<typeof fetchBook>>["pages"] | null = null;
  try {
    pages = (await fetchBook(bookId, pathLocale, searchParams.version)).pages;
  } catch (e) {}

  if (pages === null) {
    notFound();
  }

  return <ReaderContent pages={pages} />;
}

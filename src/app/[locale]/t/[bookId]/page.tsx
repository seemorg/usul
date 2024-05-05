import { fetchBook } from "@/server/services/books";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import { getMetadata } from "@/lib/seo";
import { getPathLocale } from "@/lib/locale/server";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { navigation } from "@/lib/urls";
import type { LocalePageParams } from "@/types/localization";
import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils";

export const generateMetadata = async ({
  params: { bookId, locale },
}: LocalePageParams & {
  params: {
    bookId: string;
  };
}) => {
  const pathLocale = supportedBcp47LocaleToPathLocale(locale);
  const book = await fetchBook(bookId, pathLocale);

  if (!book) return {};

  const name = getPrimaryLocalizedText(
    book.book.primaryNameTranslations,
    pathLocale,
  );

  return getMetadata({
    locale,
    title: name,
    pagePath: navigation.books.reader(bookId),
    keywords: book.book.primaryNameTranslations
      .map((t) => t.text)
      .concat(book.book.otherNameTranslations.flatMap((t) => t.texts)),
    authors: [
      {
        name: getPrimaryLocalizedText(
          book.book.author.primaryNameTranslations,
          pathLocale,
        ),
        url: navigation.authors.bySlug(book.book.author.slug),
      },
    ],
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

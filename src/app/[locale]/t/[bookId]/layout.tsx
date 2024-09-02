import { getPathLocale } from "@/lib/locale/server";
import ReaderContextProviders from "./_components/context";
import { fetchBook } from "@/server/services/books";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderContextProviders>{children}</ReaderContextProviders>;
}

export const generateMetadata = async ({
  params: { bookId, versionId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
}) => {
  const pathLocale = await getPathLocale();
  const book = await fetchBook(bookId, pathLocale, versionId);

  if (!book) return {};

  const name = getPrimaryLocalizedText(
    book.book.primaryNameTranslations,
    pathLocale,
  );

  return getMetadata({
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

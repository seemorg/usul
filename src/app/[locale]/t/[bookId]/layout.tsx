import { getPathLocale } from "@/lib/locale/server";
import ReaderContextProviders from "./_components/context";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getBook } from "@/lib/api";

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
  const response = await getBook(bookId, {
    locale: pathLocale,
    versionId,
    includeBook: true,
    fields: ["pdf", "headings", "indices", "publication_details"],
  });

  if (!response.book) return {};

  const book = response.book;

  return getMetadata({
    title: book.primaryName,
    pagePath: navigation.books.reader(bookId),
    // keywords: book.book.primaryNameTranslations
    //   .map((t) => t.text)
    //   .concat(book.book.otherNameTranslations.flatMap((t) => t.texts)),
    authors: [
      {
        name: book.author.primaryName,
        url: navigation.authors.bySlug(book.author.slug),
      },
    ],
  });
};

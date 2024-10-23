import { getPathLocale } from "@/lib/locale/server";
import ReaderContextProviders from "./_components/context";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getBook } from "@/lib/api";
import { READER_PAGINATION_SIZE } from "@/lib/constants";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    size: READER_PAGINATION_SIZE,
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

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReaderContextProviders>
      <SidebarProvider>{children}</SidebarProvider>
    </ReaderContextProviders>
  );
}

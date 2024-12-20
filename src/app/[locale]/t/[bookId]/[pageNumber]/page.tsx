import { getPathLocale } from "@/lib/locale/server";
import { notFound } from "next/navigation";
import ReaderContent from "../_components/reader-content";
import SidebarResizer from "../_components/sidebar/sidebar-resizer";
import ReaderSidebar from "../_components/sidebar";
import { getBookPage } from "@/lib/api";
import ReaderNavigation from "../_components/reader-navigation";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { permanentRedirect } from "@/navigation";
import { BookDetailsProvider } from "../_contexts/book-details.context";

export const generateMetadata = async ({
  params: { bookId, pageNumber },
  searchParams: { versionId },
}: {
  params: {
    bookId: string;
    pageNumber: string;
  };
  searchParams: {
    versionId?: string;
  };
}) => {
  const pathLocale = await getPathLocale();

  const parsedNumber = Number(pageNumber);
  if (isNaN(parsedNumber) || parsedNumber <= 0) {
    notFound();
  }

  const response = await getBookPage(bookId, {
    locale: pathLocale,
    versionId,
    includeBook: true,
    fields: ["pdf", "headings", "indices", "publication_details"],
    index: parsedNumber - 1,
  });

  if (!response || "type" in response) return {};

  const book = response.book;

  return getMetadata({
    title: book.primaryName,
    pagePath: navigation.books.reader(bookId),
    keywords: [
      ...(book.otherNames ? book.otherNames : []),
      ...(book.secondaryName ? [book.secondaryName] : []),
      ...(book.secondaryOtherNames ?? []),
    ],
    authors: [
      {
        name: book.author.primaryName,
        url: navigation.authors.bySlug(book.author.slug),
      },
    ],
  });
};

async function SidebarContent({
  params: { bookId, pageNumber },
  searchParams,
}: {
  params: {
    bookId: string;
    pageNumber: string;
  };
  searchParams: {
    versionId?: string;
    tab: string;
  };
}) {
  const { versionId } = searchParams;
  const pathLocale = await getPathLocale();

  const parsedNumber = Number(pageNumber);
  if (isNaN(parsedNumber) || parsedNumber <= 0) {
    notFound();
  }

  const response = await getBookPage(bookId, {
    locale: pathLocale,
    versionId,
    includeBook: true,
    fields: ["pdf", "headings", "indices", "publication_details"],
    index: parsedNumber - 1,
  });

  if (!response) {
    notFound();
  }

  if ("type" in response) {
    const params = new URLSearchParams(searchParams);
    const paramsString = params.size > 0 ? `?${params.toString()}` : "";

    permanentRedirect(
      `${navigation.books.pageReader(response.primarySlug, parsedNumber)}${paramsString}`,
    );
    return;
  }

  let page;
  if (response.content.source === "turath") {
    page = response.content.pages[0];
  } else if (response.content.source === "openiti") {
    page = response.content.pages[0];
  }

  if (!page) {
    notFound();
  }

  return (
    <BookDetailsProvider bookResponse={response}>
      <SidebarResizer
        sidebar={
          <ReaderSidebar bookSlug={bookId} versionId={versionId} isSinglePage />
        }
      >
        <ReaderNavigation isSinglePage />

        <article>
          <ReaderContent currentPage={parsedNumber} isSinglePage />
        </article>
      </SidebarResizer>
    </BookDetailsProvider>
  );
}
export default SidebarContent;

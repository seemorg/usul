import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { getBookPage } from "@/lib/api/books";
import { getPathLocale } from "@/lib/locale/server";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { permanentRedirect } from "@/navigation";
import { ApiBookPageResponse, ApiBookResponse } from "@/types/api/book";

import ReaderContent from "../_components/reader-content";
import ReaderNavigation from "../_components/reader-navigation";
import ReaderSidebar from "../_components/sidebar";
import SidebarResizer from "../_components/sidebar/sidebar-resizer";
import { BookDetailsProvider } from "../_contexts/book-details.context";
import ExternalBook from "../external";
import NoVersions from "../no-versions";

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    bookId: string;
    pageNumber: string;
    locale: Locale;
  }>;
  searchParams: Promise<{
    versionId?: string;
  }>;
}) => {
  const { bookId, locale, pageNumber } = await params;
  const resolvedSearchParams = await searchParams;
  const { versionId } = resolvedSearchParams;

  const pathLocale = appLocaleToPathLocale(locale);

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
  }).catch(() => null);

  if (!response || "type" in response) return {};

  const book = response.book;

  return getMetadata({
    title: book.primaryName,
    locale,
    pagePath: navigation.books.pageReader(bookId, parsedNumber),
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
  params,
  searchParams,
}: {
  params: Promise<{
    bookId: string;
    pageNumber: string;
    locale: Locale;
  }>;
  searchParams: Promise<{
    versionId?: string;
    tab: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { bookId, pageNumber, locale } = await params;
  const { versionId } = resolvedSearchParams;

  const pathLocale = await getPathLocale();

  const parsedNumber = Number(pageNumber);
  if (isNaN(parsedNumber) || parsedNumber <= 0) {
    notFound();
  }

  let bookResponse: ApiBookPageResponse;
  try {
    const response = (await getBookPage(bookId, {
      locale: pathLocale,
      versionId,
      includeBook: true,
      fields: ["pdf", "headings", "indices", "publication_details"],
      index: parsedNumber - 1,
    }))!;

    if ("type" in response) {
      const params = new URLSearchParams(resolvedSearchParams);
      const paramsString = params.size > 0 ? `?${params.toString()}` : "";

      permanentRedirect({
        href: `${navigation.books.pageReader(response.primarySlug, parsedNumber)}${paramsString}`,
        locale,
      });
      return;
    }

    bookResponse = response;
  } catch {
    notFound();
  }

  let page;
  if (bookResponse.content.source === "turath") {
    page = bookResponse.content.pages[0];
  } else if (bookResponse.content.source === "openiti") {
    page = bookResponse.content.pages[0];
  } else if (
    bookResponse.content.source === "pdf" &&
    bookResponse.content.pages
  ) {
    page = bookResponse.content.pages[0];
  }

  if (!page) {
    notFound();
  }

  return (
    <BookDetailsProvider bookResponse={bookResponse}>
      <SidebarResizer
        sidebar={
          <ReaderSidebar bookSlug={bookId} versionId={versionId} isSinglePage />
        }
      >
        <ReaderNavigation isSinglePage />

        {bookResponse.book.versions.length === 0 ? (
          <NoVersions />
        ) : bookResponse.content.source === "external" ? (
          <ExternalBook />
        ) : (
          <article>
            <ReaderContent currentPage={parsedNumber} isSinglePage />
          </article>
        )}
      </SidebarResizer>
    </BookDetailsProvider>
  );
}
export default SidebarContent;

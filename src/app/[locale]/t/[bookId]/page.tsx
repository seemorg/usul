import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/api/books";
import { READER_PAGINATION_SIZE } from "@/lib/constants";
import { getPathLocale } from "@/lib/locale/server";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { permanentRedirect } from "@/navigation";
import { ApiBookResponse } from "@/types/api/book";

import PdfViewClient from "./_components/pdf-view/client";
import ReaderContent from "./_components/reader-content";
import ReaderNavigation from "./_components/reader-navigation";
import ReaderSidebar from "./_components/sidebar";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import { BookDetailsProvider } from "./_contexts/book-details.context";
import ExternalBook from "./external";
import NoVersions from "./no-versions";

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    bookId: string;
    locale: Locale;
  }>;
  searchParams: Promise<{
    versionId?: string;
  }>;
}) => {
  const { bookId, locale } = await params;
  const { versionId } = await searchParams;

  const pathLocale = appLocaleToPathLocale(locale);

  const response = await getBook(bookId, {
    locale: pathLocale,
    versionId,
    includeBook: true,
    fields: ["pdf", "headings", "indices", "publication_details"],
    size: READER_PAGINATION_SIZE,
  });

  if (!response || "type" in response) return {};

  const book = response.book;

  return getMetadata({
    image: {
      url: `/api/og/book/${bookId}`,
      width: 1200,
      height: 720,
    },
    title: book.primaryName,
    locale,
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

export default async function SidebarContent({
  params,
  searchParams,
}: {
  params: Promise<{
    bookId: string;
    locale: Locale;
  }>;
  searchParams: Promise<{
    versionId?: string;
    tab: string;
    view: "pdf" | "default";
  }>;
}) {
  const { bookId, locale } = await params;
  const resolvedSearchParams = await searchParams;
  const { versionId, view } = resolvedSearchParams;

  const pathLocale = await getPathLocale();

  let readerContent: React.ReactNode;

  const response = await getBook(bookId, {
    locale: pathLocale,
    versionId,
    includeBook: true,
    fields: ["pdf", "headings", "indices", "publication_details"],
    size: READER_PAGINATION_SIZE,
  });

  if (!response) {
    notFound();
  }

  // if it's an alternate slug, redirect to the primary slug
  if ("type" in response) {
    const params = new URLSearchParams(resolvedSearchParams);
    const paramsString = params.size > 0 ? `?${params.toString()}` : "";

    permanentRedirect({
      href: `${navigation.books.reader(response.primarySlug)}${paramsString}`,
      locale,
    });
    return;
  }

  if (response.book.versions.length === 0) {
    readerContent = <NoVersions />;
  } else if (response.content.source === "external") {
    readerContent = <ExternalBook />;
  } else if (
    // if this is a pdf book that's not digitized, or the user is requesting the pdf view
    // we need to show the pdf view
    (response.content.source === "pdf" && !("pages" in response.content)) ||
    view === "pdf"
  ) {
    const pdfUrl =
      ("pdfUrl" in response.content ? response.content.pdfUrl : undefined) ||
      (response.content.source === "pdf" ? response.content.url : undefined);

    if (!pdfUrl) {
      notFound();
    }

    readerContent = <PdfViewClient pdf={pdfUrl} />;
  } else {
    readerContent = (
      <article>
        <ReaderContent />
      </article>
    );
  }

  return (
    <BookDetailsProvider bookResponse={response}>
      <SidebarResizer
        sidebar={<ReaderSidebar bookSlug={bookId} versionId={versionId} />}
      >
        <ReaderNavigation />

        {readerContent}
      </SidebarResizer>
    </BookDetailsProvider>
  );
}

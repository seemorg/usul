import { getPathLocale } from "@/lib/locale/server";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderSidebar from "./_components/sidebar";
import { ArrowUpRightIcon, FileQuestionIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { getBook } from "@/lib/api";
import { READER_PAGINATION_SIZE } from "@/lib/constants";
import ReaderNavigation from "./_components/reader-navigation";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { permanentRedirect } from "@/navigation";

const PdfView = dynamic(() => import("./_components/pdf-view"), {
  ssr: false,
});

export const generateMetadata = async ({
  params: { bookId },
  searchParams: { versionId },
}: {
  params: {
    bookId: string;
  };
  searchParams: {
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

  if (!response || "type" in response) return {};

  const book = response.book;

  return getMetadata({
    title: book.primaryName,
    pagePath: navigation.books.reader(bookId),
    keywords: [
      ...book.otherNames,
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
  params: { bookId },
  searchParams,
}: {
  params: {
    bookId: string;
  };
  searchParams: {
    versionId?: string;
    tab: string;
    view: "pdf" | "default";
  };
}) {
  const { versionId, view } = searchParams;

  const pathLocale = await getPathLocale();
  const t = await getTranslations("reader");

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

  if ("type" in response) {
    const params = new URLSearchParams(searchParams);
    const paramsString = params.size > 0 ? `?${params.toString()}` : "";

    permanentRedirect(
      `${navigation.books.reader(response.primarySlug)}${paramsString}`,
    );
    return;
  }

  let pages;
  if (response.content.source === "turath") {
    pages = response.content.pages;
  } else if (response.content.source === "openiti") {
    pages = response.content;
  } else {
    pages = null;
  }

  return (
    <SidebarResizer
      sidebar={
        <ReaderSidebar
          bookSlug={bookId}
          versionId={versionId}
          bookResponse={response}
        />
      }
    >
      <ReaderNavigation bookResponse={response} />

      {pages ? (
        view === "pdf" &&
        response.content.source === "turath" &&
        response.content.pdf ? (
          <PdfView pdf={response.content.pdf} />
        ) : (
          <article>
            <ReaderContent response={response} />
          </article>
        )
      ) : (
        <div className="mx-auto mt-36 w-full min-w-0 max-w-4xl flex-auto divide-y-2 divide-border px-5 lg:!px-8 xl:!px-16">
          <div className="flex flex-col items-center justify-center py-20">
            <FileQuestionIcon className="h-16 w-16 text-muted-foreground" />

            <h3 className="mt-4 text-xl font-medium">
              {t("external-book.title")}
            </h3>

            <p className="mt-2 text-secondary-foreground">
              {t("external-book.description")}
            </p>

            <Button asChild variant="default" className="mt-6 gap-2">
              <a href={response.content.versionId}>
                {t("external-book.navigate")}
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </SidebarResizer>
  );
}

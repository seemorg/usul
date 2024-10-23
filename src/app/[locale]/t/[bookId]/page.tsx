import { getPathLocale } from "@/lib/locale/server";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import { ArrowUpRightIcon, FileQuestionIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { getBook } from "@/lib/api";
import { READER_PAGINATION_SIZE } from "@/lib/constants";
import { SidebarInset } from "@/components/ui/sidebar";
import Navbar from "@/app/_components/navbar";
import ReaderSidebar from "./_components/sidebar";

const PdfView = dynamic(() => import("./_components/pdf-view"), {
  ssr: false,
});

export default async function ReaderPage({
  params: { bookId },
  searchParams: { tab: _tabId, versionId, view },
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
  const pathLocale = await getPathLocale();
  const t = await getTranslations("reader");

  let response: Awaited<ReturnType<typeof getBook>> | null = null;
  try {
    response = await getBook(bookId, {
      locale: pathLocale,
      versionId,
      includeBook: true,
      fields: ["pdf", "headings", "indices", "publication_details"],
      size: READER_PAGINATION_SIZE,
    });
  } catch (e) {}

  if (response === null) {
    notFound();
  }

  let pages;
  if (response.content.source === "turath") {
    pages = response.content.pages;
  } else if (response.content.source === "openiti") {
    pages = response.content;
  } else {
    pages = null;
  }

  let children;
  if (!pages) {
    children = (
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
    );
  }

  if (
    view === "pdf" &&
    response.content.source === "turath" &&
    response.content.pdf
  ) {
    children = <PdfView pdf={response.content.pdf} />;
  }

  children = (
    <article>
      <ReaderContent response={response} />
    </article>
  );

  return (
    <>
      <SidebarInset>
        <Navbar layout="reader" />
        <main>{children}</main>
      </SidebarInset>
      <ReaderSidebar
        bookResponse={response}
        bookSlug={response.book.slug}
        versionId={response.content.versionId}
      />
    </>
  );
}

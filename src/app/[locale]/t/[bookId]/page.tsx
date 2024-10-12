import { getPathLocale } from "@/lib/locale/server";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderSidebar from "./_components/sidebar";
import { MobileSidebarProvider } from "./_components/mobile-sidebar-provider";
import { tabs } from "./_components/sidebar/tabs";
import { ArrowUpRightIcon, FileQuestionIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { getBook } from "@/lib/api";
import { READER_PAGINATION_SIZE } from "@/lib/constants";
import Container from "@/components/ui/container";
import ReaderNavigation from "./_components/reader-navigation";

const PdfView = dynamic(() => import("./_components/pdf-view"), {
  ssr: false,
});

export default async function SidebarContent({
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

  const mobile = tabs.map((tab) => {
    return (
      <MobileSidebarProvider
        key={tab.id}
        icon={<tab.icon className="h-5 w-5 dark:text-white" />}
        tabId={tab.id}
        bookSlug={bookId}
        versionId={versionId}
        bookResponse={response as any}
      />
    );
  });

  return (
    <SidebarResizer
      // secondNav={
      //   <div className="relative flex w-full items-center justify-between bg-slate-50 dark:bg-card lg:hidden">
      //     {mobile}
      //   </div>
      // }
      // secondNav={

      // }
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

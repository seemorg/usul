import { getPathLocale } from "@/lib/locale/server";
import { fetchBook } from "@/server/services/books";
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

  let response: Awaited<ReturnType<typeof fetchBook>> | null = null;
  try {
    response = await fetchBook(bookId, pathLocale, versionId);
  } catch (e) {}

  if (response === null) {
    notFound();
  }

  let pages;
  if (response.source === "turath") {
    pages = response.turathResponse.pages;
  } else if (response.source === "openiti") {
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
      secondNav={
        <div className="relative flex w-full items-center justify-between bg-slate-50 dark:bg-card lg:hidden">
          {mobile}
        </div>
      }
      sidebar={
        <ReaderSidebar
          bookSlug={bookId}
          versionId={versionId}
          bookResponse={response}
        />
      }
    >
      {pages ? (
        view === "pdf" && response.source === "turath" ? (
          <PdfView pdf={response.turathResponse.pdf} />
        ) : (
          <article>
            <ReaderContent pages={pages} />
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
              <a href={response.versionId}>
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

import { getPathLocale } from "@/lib/locale/server";
import { fetchBook } from "@/server/services/books";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderSidebar from "./_components/sidebar";
import { MobileSidebarProvider } from "./_components/mobile-sidebar-provider";
import { tabs } from "./_components/sidebar/tabs";

export default async function SidebarContent({
  params: { bookId },
  searchParams: { tab: _tabId, versionId },
}: {
  params: {
    bookId: string;
  };
  searchParams: {
    versionId?: string;
    tab: string;
  };
}) {
  const pathLocale = await getPathLocale();

  let response: Awaited<ReturnType<typeof fetchBook>> | null = null;
  try {
    response = await fetchBook(bookId, pathLocale, versionId);
  } catch (e) {}

  if (response === null) {
    notFound();
  }

  const pages =
    "turathResponse" in response
      ? response.turathResponse.pages
      : response.pages;

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
      <article>
        <ReaderContent pages={pages} />
      </article>
    </SidebarResizer>
  );
}

import { getPathLocale } from "@/lib/locale/server";
import ReaderContextProviders from "./_components/context";
import { fetchBook } from "@/server/services/books";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderSidebar from "./_components/sidebar";
import ReaderContent from "./_components/reader-content";
import { notFound } from "next/navigation";
import { MobileSidebarProvider } from "./_components/mobile-sidebar-provider";
import { tabs } from "./_components/sidebar/tabs";

type BookResponseType = Awaited<ReturnType<typeof fetchBook>>;

export default async function ReaderLayout({
  children,
  params: { bookId, versionId },
}: {
  children: React.ReactNode;
  params: {
    bookId: string;
    versionId?: string;
  };
}) {
  const pathLocale = await getPathLocale();

  let pages:
    | NonNullable<BookResponseType["pages"]>
    | NonNullable<BookResponseType["turathResponse"]>["pages"]
    | null = null;
  try {
    const response = await fetchBook(bookId, pathLocale, versionId);
    pages = response.turathResponse
      ? response.turathResponse.pages
      : response.pages;
  } catch (e) {}

  if (pages === null) {
    notFound();
  }

  const mobile = tabs.map((tab) => {
    return (
      <MobileSidebarProvider
        key={tab.id}
        icon={<tab.icon className="h-5 w-5" />}
        href={tab.href(bookId)}
      >
        {children}
      </MobileSidebarProvider>
    );
  });

  return (
    <ReaderContextProviders>
      <SidebarResizer
        secondNav={
          <div className="relative flex w-full items-center justify-between bg-slate-50 dark:bg-card lg:hidden">
            {mobile}
          </div>
        }
        sidebar={<ReaderSidebar bookId={bookId}>{children}</ReaderSidebar>}
      >
        <article>
          <ReaderContent pages={pages} />
        </article>
      </SidebarResizer>
    </ReaderContextProviders>
  );
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
  const book = await fetchBook(bookId, pathLocale, versionId);

  if (!book) return {};

  const name = getPrimaryLocalizedText(
    book.book.primaryNameTranslations,
    pathLocale,
  );

  return getMetadata({
    title: name,
    pagePath: navigation.books.reader(bookId),
    keywords: book.book.primaryNameTranslations
      .map((t) => t.text)
      .concat(book.book.otherNameTranslations.flatMap((t) => t.texts)),
    authors: [
      {
        name: getPrimaryLocalizedText(
          book.book.author.primaryNameTranslations,
          pathLocale,
        ),
        url: navigation.authors.bySlug(book.book.author.slug),
      },
    ],
  });
};

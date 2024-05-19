import { fetchBook } from "@/server/services/books";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import { getMetadata } from "@/lib/seo";
import { getPathLocale } from "@/lib/locale/server";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { navigation } from "@/lib/urls";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderSidebar, { tabs } from "./_components/sidebar";
import { MobileSidebarProvider } from "./_components/mobile-sidebar-provider";

export const generateMetadata = async ({
  params: { bookId },
  searchParams,
}: {
  params: {
    bookId: string;
  };
  searchParams: ReaderSearchParams;
}) => {
  const pathLocale = await getPathLocale();
  const book = await fetchBook(bookId, pathLocale, searchParams.version);

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

type ResponseType = Awaited<ReturnType<typeof fetchBook>>;

export default async function ReaderPage({
  params: { bookId },
  searchParams,
}: {
  params: {
    bookId: string;
  };
  searchParams: ReaderSearchParams;
}) {
  const pathLocale = await getPathLocale();

  let pages:
    | NonNullable<ResponseType["pages"]>
    | NonNullable<ResponseType["turathResponse"]>["pages"]
    | null = null;
  try {
    const response = await fetchBook(bookId, pathLocale, searchParams.version);
    pages = response.turathResponse
      ? response.turathResponse.pages
      : response.pages;
  } catch (e) {}

  if (pages === null) {
    notFound();
  }

  return (
    <SidebarResizer
      secondNav={
        <div className="relative flex w-full items-center justify-between bg-slate-50 dark:bg-card lg:hidden">
          {tabs.map((tab) => {
            return (
              <MobileSidebarProvider
                key={tab.id}
                icon={<tab.icon className="h-5 w-5" />}
              >
                <tab.content bookId={bookId} searchParams={searchParams} />
              </MobileSidebarProvider>
            );
          })}
        </div>
      }
      sidebar={<ReaderSidebar bookId={bookId} searchParams={searchParams} />}
    >
      {/* <Container className="w-full min-w-0 flex-auto py-10 pt-20 lg:pl-0 lg:pr-8 xl:px-16"> */}
      <article>
        <ReaderContent pages={pages} />
      </article>

      {/* <dl className="flex pt-6 mt-12 border-t border-slate-200">
          {previousPage && (
            <div>
              <dt className="text-sm font-medium font-display text-secondary">
                Previous Chapter
              </dt>
              <dd className="mt-1">
                <Link
                  href={previousPage.href}
                  className="text-base font-semibold text-slate-500 hover:text-slate-600"
                >
                  <span aria-hidden="true">&larr;</span>{" "}
                  {previousPage.title}
                </Link>
              </dd>
            </div>
          )}
          {nextPage && (
            <div className="ml-auto text-right">
              <dt className="text-sm font-medium font-display text-secondary">
                Next Chapter
              </dt>
              <dd className="mt-1">
                <Link
                  href={nextPage.href}
                  className="text-base font-semibold text-slate-500 hover:text-slate-600 "
                >
                  {nextPage.title} <span aria-hidden="true">&rarr;</span>
                </Link>
              </dd>
            </div>
          )}
        </dl> */}
      {/* </Container> */}
      {/* <Footer /> */}
    </SidebarResizer>
  );
}

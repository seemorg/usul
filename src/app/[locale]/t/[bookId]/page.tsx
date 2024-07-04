import { getPathLocale } from "@/lib/locale/server";
import { fetchBook } from "@/server/services/books";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";

export default async function SidebarContent({
  params: { bookId, versionId },
  searchParams: { tab: _tabId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
  searchParams: {
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

  const pages = response.turathResponse
    ? response.turathResponse.pages
    : response.pages;

  return <ReaderContent pages={pages} />;
}

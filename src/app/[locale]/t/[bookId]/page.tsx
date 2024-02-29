import { fetchBook } from "@/server/services/books";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";

export default async function ReaderPage({
  params: { bookId },
  searchParams,
}: {
  params: {
    bookId: string;
  };
  searchParams: ReaderSearchParams;
}) {
  let pages: Awaited<ReturnType<typeof fetchBook>>["pages"] | null = null;
  try {
    pages = (await fetchBook(bookId, searchParams.version)).pages;
  } catch (e) {}

  if (pages === null) {
    notFound();
  }

  return <ReaderContent pages={pages} />;
}

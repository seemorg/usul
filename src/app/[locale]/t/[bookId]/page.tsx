import { fetchBook } from "@/server/services/books";
import type { ReaderSearchParams } from "@/types/reader-search-params";
import { notFound } from "next/navigation";
import ReaderContent from "./_components/reader-content";
import { getMetadata } from "@/lib/seo";

export const generateMetadata = async ({
  params: { bookId },
}: {
  params: {
    bookId: string;
  };
}) => {
  const book = await fetchBook(bookId);
  const name = book?.book?.primaryLatinName ?? book?.book?.primaryArabicName;

  if (!name) return {};

  return getMetadata({
    title: name,
  });
};

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

import { useParams } from "next/navigation";
import { useBookDetails } from "@/app/[locale]/t/[bookId]/_contexts/book-details.context";

import type { Source } from ".";

function SourceTitleInner({ source }: { source: Source }) {
  const { bookResponse } = useBookDetails();

  // Only get chapter info when bookResponse is available
  const chapterIndex = source.metadata.chapters[0];
  const chapter =
    chapterIndex !== undefined && "headings" in bookResponse.content
      ? bookResponse.content.headings?.[chapterIndex]?.title
      : undefined;

  return chapter ? <bdi>{chapter}</bdi> : null;
}

export function SourceTitle({ source }: { source: Source }) {
  const slugParam = useParams().bookId as string;

  if (slugParam) return <SourceTitleInner source={source} />;
  if (source.book) return <bdi>{source.book.primaryName}</bdi>;
  return null;
}

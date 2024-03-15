/* eslint-disable react/jsx-key */
"use client";

import type { searchBooks } from "@/lib/search";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import Image from "next/image";
import InfoDialog from "./info-dialog";
import DottedList from "../ui/dotted-list";
import type { View } from "@/validation/view";

const BookSearchResult = ({
  result,
  view,
}: {
  view?: View;
  result: NonNullable<
    Awaited<ReturnType<typeof searchBooks>>["results"]["hits"]
  >[number];
}) => {
  const { document, highlight } = result;

  const { primaryArabicName, primaryLatinName, author } = document;

  const title = highlight?.primaryArabicName?.snippet
    ? highlight?.primaryArabicName.snippet
    : primaryArabicName ?? primaryLatinName;
  const secondaryTitle =
    primaryArabicName && primaryLatinName
      ? highlight?.primaryLatinName?.snippet ?? primaryLatinName
      : null;

  const authorName = author?.primaryArabicName ?? author?.primaryLatinName;
  const authorSecondaryName =
    author?.primaryArabicName && author?.primaryLatinName
      ? author?.primaryLatinName
      : null;

  if (view === "grid") {
    return (
      <div className="group relative mx-auto block h-full w-4/5 md:w-full">
        <InfoDialog result={result} />

        <Link href={navigation.books.reader(document.slug)} prefetch={false}>
          <div
            className={cn(
              "relative flex aspect-[1600/2300] w-full flex-col items-center justify-center gap-6 rounded-md bg-gray-200 p-8 text-gray-700",
            )}
          >
            <Image
              src={`https://assets.digitalseem.org/covers/${document.slug}.png`}
              alt={title}
              width={320}
              height={460}
              className="absolute inset-0 h-full w-full rounded-md object-cover"
              placeholder="empty"
            />
          </div>
          <div className="mt-2">
            <p
              className="mt-2 text-lg font-semibold"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: title }}
              title={title}
            />

            {secondaryTitle && (
              <p
                className="mt-2 text-right"
                dangerouslySetInnerHTML={{ __html: secondaryTitle }}
                title={secondaryTitle}
              />
            )}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={navigation.books.reader(document.slug)}
      prefetch={false}
      className="flex w-full items-center justify-between gap-4 border-b border-border bg-transparent px-6 py-6 transition-colors hover:bg-secondary"
    >
      <div className="flex-1 text-xl">
        <h3
          className="text-lg font-semibold"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <DottedList
          className="mt-2 text-xs text-muted-foreground"
          items={[
            secondaryTitle && (
              <p dangerouslySetInnerHTML={{ __html: secondaryTitle }} />
            ),
            <p>{authorName}</p>,
            authorSecondaryName && <p>{authorSecondaryName}</p>,
          ]}
        />
      </div>

      <p>{document.year} AH</p>
    </Link>
  );
};

export default BookSearchResult;

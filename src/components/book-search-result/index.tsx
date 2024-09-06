/* eslint-disable react/jsx-key */
"use client";

import type { searchBooks } from "@/server/typesense/book";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import InfoDialog from "./info-dialog";
import DottedList from "../ui/dotted-list";
import type { View } from "@/validation/view";
import { CloudflareImage } from "../cloudflare-image";
import { useTranslations } from "next-intl";
import { usePathLocale } from "@/lib/locale/utils";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";

const BookSearchResult = ({
  result,
  view,
}: {
  view?: View;
  result: Awaited<ReturnType<typeof searchBooks>>["results"]["hits"][number];
}) => {
  const t = useTranslations();
  const pathLocale = usePathLocale();
  const { document } = result;

  const { primaryNames, author } = document;

  const title =
    document.transliteration && pathLocale === "en"
      ? document.transliteration
      : getPrimaryLocalizedText(primaryNames, pathLocale) ?? "";
  const secondaryTitle = getSecondaryLocalizedText(primaryNames, pathLocale);

  const authorPrimaryNames =
    author?.primaryNames ?? (author as any)?.primaryNameTranslations;

  const authorName =
    author.transliteration && pathLocale === "en"
      ? author.transliteration
      : authorPrimaryNames
        ? getPrimaryLocalizedText(authorPrimaryNames, pathLocale)
        : undefined;
  const authorSecondaryName = author?.primaryNames
    ? getSecondaryLocalizedText(author.primaryNames, pathLocale)
    : undefined;

  if (view === "grid") {
    return (
      <div className="group relative mx-auto block h-full w-full">
        <InfoDialog result={result} />

        <Link href={navigation.books.reader(document.slug)} prefetch={false}>
          <div className={cn("overflow-hidden rounded-md bg-muted")}>
            <CloudflareImage
              src={`https://assets.usul.ai/covers/${document.slug}.png`}
              alt={title}
              width={320}
              height={460}
              className="aspect-[1600/2300] w-full object-cover"
              placeholder="empty"
            />
          </div>

          <div className="mt-2">
            <p
              className="mt-2 text-wrap text-lg font-semibold"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: title }}
              title={title}
            />

            {authorName && (
              <p
                className="mt-1 line-clamp-2 text-wrap text-right text-sm text-muted-foreground"
                title={authorName}
              >
                {authorName}
              </p>
            )}

            {secondaryTitle && (
              <p
                className="mt-1 text-wrap text-right"
                dangerouslySetInnerHTML={{ __html: secondaryTitle }}
                title={secondaryTitle}
              />
            )}
          </div>
        </Link>
      </div>
    );
  }

  const deathYearString = author.year ? ` (d. ${author.year})` : "";

  return (
    <Link
      href={navigation.books.reader(document.slug)}
      prefetch={false}
      className="flex w-full items-center justify-between gap-4 border-b border-border bg-transparent px-2 py-6 transition-colors hover:bg-secondary dark:hover:bg-secondary/20 sm:px-6"
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
            <p>
              {authorName}
              {deathYearString}
            </p>,
            authorSecondaryName && (
              <p>
                {authorSecondaryName}
                {deathYearString}
              </p>
            ),
          ]}
        />
      </div>

      <p>{t("common.year-format.ah.value", { year: document.year })}</p>
    </Link>
  );
};

export default BookSearchResult;

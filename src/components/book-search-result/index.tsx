import type { searchBooks } from "@/server/typesense/book";
import type { View } from "@/validation/view";
import { formatDeathYear } from "@/lib/date";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { useTranslations } from "next-intl";

import { CloudflareImage } from "../cloudflare-image";
import EntityCard from "../entity-card";
import InfoDialog from "./info-dialog";

export default function BookSearchResult({
  result,
  view,
  prefetch = true,
}: {
  view?: View;
  result: Awaited<ReturnType<typeof searchBooks>>["results"]["hits"][number];
  prefetch?: boolean;
}) {
  const t = useTranslations();
  const dir = useDirection();
  const pathLocale = usePathLocale();
  const { document } = result;

  const { primaryNames, author } = document;

  const title = (
    document.transliteration && pathLocale === "en"
      ? document.transliteration
      : "primaryName" in document
        ? document.primaryName
        : primaryNames
          ? (getPrimaryLocalizedText(primaryNames, pathLocale) ?? "")
          : ""
  ) as string;

  const secondaryTitle = getSecondaryLocalizedText(primaryNames, pathLocale);

  const authorPrimaryNames =
    author.primaryNames ?? (author as any)?.primaryNameTranslations;

  const authorName = (
    author.transliteration && pathLocale === "en"
      ? author.transliteration
      : "primaryName" in author
        ? author.primaryName
        : authorPrimaryNames
          ? getPrimaryLocalizedText(authorPrimaryNames, pathLocale)
          : undefined
  ) as string | undefined;

  const authorSecondaryName = (
    "secondaryName" in author
      ? author.secondaryName
      : author.primaryNames
        ? getSecondaryLocalizedText(author.primaryNames, pathLocale)
        : undefined
  ) as string | undefined;

  if (view === "grid") {
    return (
      <div className="group relative mx-auto block h-full w-full">
        <InfoDialog result={result} />

        <Link href={navigation.books.reader(document.slug)} prefetch={prefetch}>
          <div className={cn("bg-muted overflow-hidden rounded-md")}>
            {document.coverUrl ? (
              <CloudflareImage
                src={document.coverUrl}
                alt={title}
                width={320}
                height={460}
                className="aspect-1600/2300 w-full object-cover"
                placeholder="empty"
              />
            ) : (
              <div className="bg-muted aspect-1600/2300 w-full" />
            )}
          </div>

          <div className="mt-2">
            <p
              className="mt-2 line-clamp-2 text-lg font-semibold text-wrap"
              dir={dir}
              dangerouslySetInnerHTML={{ __html: title }}
              title={title}
            />

            {authorName && (
              <p
                className="text-muted-foreground mt-1 line-clamp-2 text-sm text-wrap"
                title={authorName}
                dir={dir}
              >
                {authorName}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  }

  let hasPdf = false;
  let hasEbook = false;
  let hasExternal = false;

  for (const version of document.versions) {
    if (version.source === "pdf" || !!version.pdfUrl) {
      hasPdf = true;
    }

    if (version.source === "openiti" || version.source === "turath") {
      hasEbook = true;
    }

    if (version.source === "external") {
      hasExternal = true;
    }
  }

  return (
    <EntityCard
      href={navigation.books.reader(document.slug)}
      prefetch={prefetch}
      primaryTitle={title}
      secondaryTitle={secondaryTitle}
      primarySubtitle={
        authorName
          ? `${authorName} (${formatDeathYear(author.year, pathLocale)})`
          : undefined
      }
      secondarySubtitle={
        authorSecondaryName
          ? `${authorSecondaryName} (${formatDeathYear(author.year, "ar")})`
          : undefined
      }
      tags={[
        hasPdf && t("common.pdf"),
        hasEbook && t("common.e-book"),
        hasExternal && t("common.url"),
      ]}
    />
  );
}

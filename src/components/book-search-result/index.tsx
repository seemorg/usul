import type { searchBooks } from "@/server/typesense/book";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import InfoDialog from "./info-dialog";
import type { View } from "@/validation/view";
import { CloudflareImage } from "../cloudflare-image";
import { useTranslations } from "next-intl";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { Badge } from "../ui/badge";

const BookSearchResult = ({
  result,
  view,
  prefetch = true,
}: {
  view?: View;
  result: Awaited<ReturnType<typeof searchBooks>>["results"]["hits"][number];
  prefetch?: boolean;
}) => {
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
          ? getPrimaryLocalizedText(primaryNames, pathLocale) ?? ""
          : ""
  ) as string;

  const secondaryTitle = getSecondaryLocalizedText(primaryNames, pathLocale);

  const authorPrimaryNames =
    author?.primaryNames ?? (author as any)?.primaryNameTranslations;

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
      : author?.primaryNames
        ? getSecondaryLocalizedText(author.primaryNames, pathLocale)
        : undefined
  ) as string | undefined;

  if (view === "grid") {
    return (
      <div className="group relative mx-auto block h-full w-full">
        <InfoDialog result={result} />

        <Link href={navigation.books.reader(document.slug)} prefetch={prefetch}>
          <div className={cn("overflow-hidden rounded-md bg-muted")}>
            {document.coverUrl ? (
              <CloudflareImage
                src={document.coverUrl}
                alt={title}
                width={320}
                height={460}
                className="aspect-[1600/2300] w-full object-cover"
                placeholder="empty"
              />
            ) : (
              <div className="aspect-[1600/2300] w-full bg-muted" />
            )}
          </div>

          <div className="mt-2">
            <p
              className="mt-2 line-clamp-2 text-wrap text-lg font-semibold"
              dir={dir}
              dangerouslySetInnerHTML={{ __html: title }}
              title={title}
            />

            {authorName && (
              <p
                className="mt-1 line-clamp-2 text-wrap text-sm text-muted-foreground"
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

  const deathYearString =
    author.year && author.year > 0
      ? ` (d. ${author.year} AH)`
      : " (d. Unknown)";
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
    <Link
      href={navigation.books.reader(document.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-2 py-6 transition-colors hover:bg-secondary/50 dark:hover:bg-secondary/20 sm:px-3"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex-1">
          <h3
            className="text-lg font-bold"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {authorName && (
            <bdi className="mt-2 block text-base text-muted-foreground">
              {authorName} {deathYearString}
            </bdi>
          )}
        </div>

        {secondaryTitle && (
          <div className="flex-1" dir="rtl">
            <h3
              className="text-lg font-bold"
              dangerouslySetInnerHTML={{ __html: secondaryTitle }}
            />

            {authorSecondaryName && (
              <bdi className="mt-2 block text-base text-muted-foreground">
                {authorSecondaryName} {deathYearString}
              </bdi>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {hasPdf && (
          <Badge variant="muted" className="font-normal">
            {t("common.pdf")}
          </Badge>
        )}
        {hasEbook && (
          <Badge variant="muted" className="font-normal">
            {t("common.e-book")}
          </Badge>
        )}
        {hasExternal && (
          <Badge variant="muted" className="font-normal">
            {t("common.url")}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default BookSearchResult;

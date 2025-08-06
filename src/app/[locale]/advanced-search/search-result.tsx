import type { SearchCorpusResponse } from "@/server/services/chat";
import { Badge } from "@/components/ui/badge";
import { removeDiacritics } from "@/lib/diacritics";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function AdvancedSearchResult({
  result,
}: {
  result: SearchCorpusResponse["results"][number];
}) {
  const pathLocale = usePathLocale();
  const t = useTranslations("common");

  const book = result.node.book;
  const author = book.author;

  const title =
    book.transliteration && pathLocale === "en"
      ? book.transliteration
      : book.primaryName;
  const secondaryTitle = book.secondaryName;

  const authorName =
    author.transliteration && pathLocale === "en"
      ? author.transliteration
      : author.primaryName;
  const authorSecondaryName = author.secondaryName;

  const page = result.node.metadata.pages[0];
  const versionId = result.node.metadata.versionId;

  const content =
    "text" in result.node
      ? removeDiacritics(result.node.text).replaceAll("\n", "<br>")
      : result.node.highlights.join("<br>...<br>");

  return (
    <Link
      href={
        (page
          ? navigation.books.pageReader(result.node.book.slug, page.index)
          : navigation.books.reader(result.node.book.slug)) +
        `?versionId=${versionId}`
      }
      className="border-border bg-card rounded-lg border p-4"
    >
      <p
        dir="rtl"
        className="font-scheherazade [&>em]:text-primary mt-4 sm:text-xl/relaxed [&>em]:font-bold [&>em]:not-italic"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <div className="text-muted-foreground mt-5 flex gap-2 text-sm" dir="rtl">
        <div>
          {page?.volume && (
            <span>
              {isNaN(Number(page.volume))
                ? page.volume
                : t("pagination.vol-x", { volume: page.volume })}{" "}
              /{" "}
            </span>
          )}
          <span>{t("pagination.page-x", { page: page ? page.page : -1 })}</span>
        </div>
        <Badge variant="muted">{result.score.toFixed(2)}</Badge>
      </div>

      <div className="mt-2 flex w-full items-start justify-between gap-3">
        <div className="flex-1">
          <h3
            className="text-base font-semibold"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>

        {secondaryTitle && (
          <bdi className="flex-1">
            <h3
              className="text-base font-semibold"
              dangerouslySetInnerHTML={{
                __html: secondaryTitle,
              }}
            />
          </bdi>
        )}
      </div>

      {authorName || authorSecondaryName ? (
        <div className="mt-1 flex w-full items-start justify-between gap-3">
          {authorName && (
            <bdi className="text-secondary-foreground block flex-1 text-xs">
              {authorName}
            </bdi>
          )}

          {authorSecondaryName && (
            <bdi className="text-secondary-foreground block flex-1 text-xs">
              {authorSecondaryName}
            </bdi>
          )}
        </div>
      ) : null}
    </Link>
  );
}

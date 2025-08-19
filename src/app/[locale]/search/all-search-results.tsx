import BookSearchResult from "@/components/book-search-result";
import DottedList from "@/components/ui/dotted-list";
import { Separator } from "@/components/ui/separator";
import { searchCorpus } from "@/lib/api/search";
import { formatDeathYear } from "@/lib/date";
import { removeDiacritics } from "@/lib/diacritics";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import SearchCarousel, { EmptyAlert } from "./search-carousel";

type Results = NonNullable<Awaited<ReturnType<typeof searchCorpus>>>;
type Content = Results["content"]["results"][number];

export const ContentCard = ({
  result,
  className,
}: {
  result: Content;
  className?: string;
}) => {
  const page = result.node.metadata.pages[0];
  const t = useTranslations();
  const versionId = result.versionId;
  const href =
    (page
      ? navigation.books.pageReader(result.book.slug, page.index)
      : navigation.books.reader(result.book.slug)) + `?versionId=${versionId}`;

  const text = result.node.highlights
    ? result.node.highlights.join("<br>...<br>")
    : removeDiacritics(result.node.text).replaceAll("\n", "<br>");

  return (
    <Link
      href={href}
      className={cn(
        "bg-card border-border flex w-lg flex-col gap-4 rounded-xl border px-6 py-5",
        className,
      )}
    >
      <bdi
        className="font-scheherazade [&>em]:text-primary line-clamp-5 block max-h-[150px] overflow-ellipsis sm:text-xl/relaxed [&>em]:font-bold [&>em]:not-italic"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />

      {page && (
        <div className="text-muted-foreground text-xs" dir="rtl">
          {page?.volume && (
            <span>
              {isNaN(Number(page.volume))
                ? page.volume
                : t("common.pagination.vol-x", { volume: page.volume })}{" "}
              /{" "}
            </span>
          )}
          <span>
            {t("common.pagination.page-x", { page: page ? page.page : -1 })}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between text-xs">
        <div className="flex-1">
          <p className="font-medium">{result.book.primaryName}</p>
          <p className="text-muted-foreground mt-1">
            {result.book.author.primaryName}
          </p>
        </div>

        <div className="flex-1">
          <bdi className="block font-medium">{result.book.secondaryName}</bdi>
          <bdi className="text-muted-foreground mt-1 block">
            {result.book.author.secondaryName}
          </bdi>
        </div>
      </div>
    </Link>
  );
};

export default function AllSearchResults({
  results,
  q,
}: {
  results: Results;
  q: string;
}) {
  const t = useTranslations();
  const locale = usePathLocale();

  return (
    <div className="flex w-full flex-col gap-10">
      <SearchCarousel
        title={t("entities.content")}
        allHref={navigation.search({
          type: "content",
          query: q,
        })}
        slidesPerScroll={1}
      >
        {results.content.results.map((result) => (
          <ContentCard key={result.book.id} result={result} />
        ))}
      </SearchCarousel>

      <SearchCarousel
        title={t("entities.x-texts", {
          count: results.books.found,
        })}
        allHref={navigation.search({
          type: "texts",
          query: q,
        })}
        itemClassName="w-[140px] shrink-0 sm:w-[160px] md:w-[180px]"
      >
        {results.books.hits.map((text) => (
          <BookSearchResult key={text.id} result={text} view="grid" />
        ))}
      </SearchCarousel>

      <div>
        <div className="flex items-center justify-between py-4">
          <p className="text-lg font-semibold">
            {results.authors.found > 0
              ? t("entities.x-authors", {
                  count: results.authors.found,
                })
              : t("entities.authors")}
          </p>

          <Link
            href={navigation.search({
              type: "authors",
              query: q,
            })}
            className="text-primary text-sm"
          >
            {t("common.view-all")}
          </Link>
        </div>

        {results.authors.hits.length === 0 ? (
          <EmptyAlert />
        ) : (
          results.authors.hits.map((author) => {
            const formattedDeathYear = formatDeathYear(author.year, locale);
            return (
              <Link
                href={navigation.authors.bySlug(author.slug)}
                key={author.id}
                className="hover:bg-muted block w-full py-4 transition-colors"
              >
                <div className="flex w-full justify-between">
                  <DottedList
                    className="flex-1"
                    items={[
                      <p className="text-sm font-medium">
                        {author.primaryName}
                      </p>,
                      formattedDeathYear && (
                        <p className="text-muted-foreground text-sm">
                          {formattedDeathYear}
                        </p>
                      ),
                    ]}
                  />

                  <bdi className="flex-1 text-sm font-medium">
                    {author.secondaryName}
                  </bdi>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div>
        <div className="flex items-center justify-between py-4">
          <p className="text-lg font-semibold">
            {results.genres.found > 0
              ? t("entities.x-genres", {
                  count: results.genres.found,
                })
              : t("entities.genres")}
          </p>

          <Link
            href={navigation.search({
              type: "genres",
              query: q,
            })}
            className="text-primary text-sm"
          >
            {t("common.view-all")}
          </Link>
        </div>

        {results.genres.hits.length === 0 ? (
          <EmptyAlert />
        ) : (
          results.genres.hits.map((genre) => (
            <Link
              href={navigation.genres.bySlug(genre.slug)}
              key={genre.id}
              className="hover:bg-muted block w-full py-4 transition-colors"
            >
              <div className="flex w-full justify-between">
                <DottedList
                  className="flex-1"
                  items={[
                    <p className="text-sm font-medium">{genre.primaryName}</p>,
                    <p className="text-muted-foreground text-sm">
                      {t("entities.x-texts", {
                        count: genre.booksCount,
                      })}
                    </p>,
                  ]}
                />

                <bdi className="flex-1 text-sm font-medium">
                  {genre.secondaryName}
                </bdi>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

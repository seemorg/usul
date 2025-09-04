import BookSearchResult from "@/components/book-search-result";
import DottedList from "@/components/ui/dotted-list";
import { searchCorpus } from "@/lib/api/search";
import { formatDeathYear } from "@/lib/date";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import { BookContentResult } from "./book-content-result";
import SearchCarousel, { EmptyAlert } from "./search-carousel";

type Results = NonNullable<Awaited<ReturnType<typeof searchCorpus>>>;

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
          <BookContentResult key={result.book.id} result={result} />
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

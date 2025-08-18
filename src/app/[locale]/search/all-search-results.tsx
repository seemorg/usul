import BookSearchResult from "@/components/book-search-result";
import DottedList from "@/components/ui/dotted-list";
import { Separator } from "@/components/ui/separator";
import { searchCorpus } from "@/lib/api/search";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import SearchCarousel, { EmptyAlert } from "./search-carousel";

type Results = NonNullable<Awaited<ReturnType<typeof searchCorpus>>>;
type Content = Results["content"]["results"][number];

const ContentCard = ({ book, node }: Content) => {
  const page = node.metadata.pages[0];
  const t = useTranslations();

  return (
    <div className="bg-card border-border flex w-lg flex-col gap-4 rounded-xl border px-6 py-5">
      <bdi
        className="font-scheherazade [&_em]:text-primary line-clamp-5 block max-h-[150px] overflow-ellipsis"
        dangerouslySetInnerHTML={{
          __html: node.highlights
            ? node.highlights.join("<br>...<br>")
            : node.text,
        }}
      />

      {/* {page && (
        <p dir="rtl" className="text-muted-foreground text-xs">
          {t("reader.chat.pg-x-vol", {
            page: page.page,
            volume: page.volume,
          })}
        </p>
      )} */}

      <Separator />

      <div className="flex justify-between text-xs">
        <div className="flex-1">
          <p className="font-medium">{book.primaryName}</p>
          <p className="text-muted-foreground mt-1">
            {book.author.primaryName}
          </p>
        </div>

        <div className="flex-1">
          <bdi className="block font-medium">{book.secondaryName}</bdi>
          <bdi className="text-muted-foreground mt-1 block">
            {book.author.secondaryName}
          </bdi>
        </div>
      </div>
    </div>
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

  return (
    <div className="flex w-full flex-col gap-10">
      <SearchCarousel
        title={t("entities.content")}
        allHref={navigation.search.index({
          type: "content",
          query: q,
        })}
        slidesPerScroll={1}
      >
        {results.content.results.map((result) => (
          <ContentCard key={result.book.id} {...result} />
        ))}
      </SearchCarousel>

      <SearchCarousel
        title={t("entities.x-texts", {
          count: results.books.found,
        })}
        allHref={navigation.search.index({
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
            {t("entities.x-authors", {
              count: results.authors.found,
            })}
          </p>

          <Link
            href={navigation.search.index({
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
          results.authors.hits.map((author) => (
            <Link
              href={navigation.authors.bySlug(author.slug)}
              key={author.id}
              className="hover:bg-muted block w-full py-4 transition-colors"
            >
              <div className="flex w-full justify-between">
                <DottedList
                  className="flex-1"
                  items={[
                    <p className="text-sm font-medium">{author.primaryName}</p>,
                    <p className="text-muted-foreground text-sm">
                      {author.year} AH
                    </p>,
                  ]}
                />

                <bdi className="flex-1 text-sm font-medium">
                  {author.secondaryName}
                </bdi>
              </div>
            </Link>
          ))
        )}
      </div>

      <div>
        <div className="flex items-center justify-between py-4">
          <p className="text-lg font-semibold">
            {t("entities.x-genres", {
              count: results.genres.found,
            })}
          </p>

          <Link
            href={navigation.search.index({
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

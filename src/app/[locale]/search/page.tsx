import type { View } from "@/validation/view";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorSearchResult from "@/components/author-search-result";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import GenreSearchResult from "@/components/genre-search-result";
import GenresFilter from "@/components/genres-filter";
import RegionSearchResult from "@/components/region-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import Container from "@/components/ui/container";
import YearFilterClient from "@/components/year-filter/client";
import {
  searchAuthors,
  searchBooks,
  searchContent,
  searchCorpus,
  searchGenres,
  searchRegions,
} from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { booksSorts, yearsSorts } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { LibraryIcon, TextCursorIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType, SearchType } from "./routeType";
import AllSearchResults, { ContentCard } from "./all-search-results";
import ContentFilters from "./content-filters";
import ContentSearchType from "./content-search-type";
import { Route } from "./routeType";
import SearchInput from "./search-input";
import SearchTypeSwitcher from "./search-type-switcher";

type TextsPageProps = InferPagePropsType<RouteType>;

async function search(params: Awaited<TextsPageProps["searchParams"]>) {
  const pathLocale = await getPathLocale();
  const {
    type,
    q,
    compiledQuery,
    sort,
    page,
    genres,
    authors,
    regions,
    year,
    searchType,
  } = params;

  const commonOptions = {
    limit: 20,
    page,
    locale: pathLocale,
  };

  if (type === "all") return searchCorpus(q, pathLocale);

  if (type === "content") {
    // For keyword search with compiled query, use the compiled query; otherwise use q
    const searchQuery =
      searchType === "keyword" && compiledQuery ? compiledQuery : q;
    return searchContent(searchQuery, searchType, page);
  }

  if (type === "texts") {
    return searchBooks(q, {
      ...commonOptions,
      sortBy: sort,
      filters: {
        genres,
        authors,
        regions,
        yearRange: year,
      },
    });
  }

  if (type === "authors") {
    return searchAuthors(q, {
      ...commonOptions,
      sortBy: sort,
      filters: {
        yearRange: year,
        regions,
      },
    });
  }

  if (type === "genres") return searchGenres(q, commonOptions);

  return searchRegions(q, commonOptions);
}

const SearchResult = ({
  type,
  view,
  result,
}: {
  type: SearchType;
  view: View;
  result: any;
}) => {
  if (type === "texts") return <BookSearchResult result={result} view={view} />;
  if (type === "authors") return <AuthorSearchResult result={result} />;
  if (type === "genres") return <GenreSearchResult result={result} />;
  if (type === "content")
    return <ContentCard result={result} className="w-full" />;

  return <RegionSearchResult result={result} />;
};

async function SearchPage({ searchParams }: TextsPageProps) {
  const resolvedSearchParams = await searchParams;
  const {
    type,
    q,
    compiledQuery,
    sort,
    genres,
    authors,
    regions,
    year,
    view,
    searchType,
  } = resolvedSearchParams;

  const t = await getTranslations();
  const results = await search(resolvedSearchParams);
  if (!results) notFound();

  const entityName = t(
    (
      {
        content: "entities.texts",
        authors: "entities.authors",
        texts: "entities.texts",
        genres: "entities.genres",
        regions: "entities.regions",
        all: "entities.texts",
      } as const
    )[type],
  );

  const showEmptyState = q.trim().length === 0;

  return (
    <>
      <Container>
        <SearchInput />
        {!showEmptyState && <SearchTypeSwitcher />}
        <div className="mt-5" />
        {showEmptyState && (
          <div className="flex min-h-[250px] w-full flex-col items-center justify-center text-center">
            <div className="border-border bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md border">
              <TextCursorIcon className="size-6" />
            </div>
            <h3 className="text-muted-foreground mt-4 text-2xl font-medium">
              Type Something to Search
            </h3>
            <p className="text-muted-foreground mt-2 text-base font-light">
              See where it leads.
            </p>
          </div>
        )}
      </Container>

      {!showEmptyState && (
        <Container
          className={cn(
            type === "content" && searchType === "keyword"
              ? "2xl:max-w-9xl max-w-6xl"
              : "",
          )}
        >
          {results ? (
            "content" in results ? (
              <AllSearchResults results={results} q={q} />
            ) : (
              <SearchResults
                showInput={false}
                hasViews={type === "texts"}
                hasSorts={type !== "content"}
                label={
                  type === "content" && (
                    <div className="flex items-center justify-between">
                      <p>
                        {t("entities.x-results", {
                          count: !("pagination" in results)
                            ? results.total
                            : results.pagination.totalRecords,
                        })}
                      </p>

                      <ContentSearchType />
                    </div>
                  )
                }
                itemsContainerClassName={
                  type === "content" ? "gap-6" : undefined
                }
                gridColumns={
                  type === "content" && searchType === "keyword"
                    ? [3, 5]
                    : undefined
                }
                response={
                  "pagination" in results
                    ? (results.results as any)
                    : {
                        page: results.currentPage,
                        hits: results.results
                          .map((r) => ({ id: r.node.id, ...r }))
                          .filter((r) => !!r.book),
                      }
                }
                pagination={
                  "pagination" in results
                    ? results.pagination
                    : {
                        hasNext: results.hasNextPage,
                        hasPrev: results.hasPreviousPage,
                        totalPages: results.totalPages,
                        currentPage: results.currentPage,
                        totalRecords: results.total,
                      }
                }
                renderResult={(result) => (
                  <SearchResult type={type} view={view} result={result} />
                )}
                emptyMessage={t("entities.no-entity", { entity: entityName })}
                placeholder={t("entities.search-within", {
                  entity: entityName,
                })}
                sorts={
                  type === "authors" || type === "texts"
                    ? yearsSorts
                    : booksSorts
                }
                currentSort={sort}
                currentQuery={q}
                view={view}
                filters={
                  type === "content" ? (
                    searchType === "keyword" ? (
                      <ContentFilters />
                    ) : null
                  ) : type === "genres" || type === "regions" ? null : (
                    <>
                      {type === "texts" || type === "authors" ? (
                        <YearFilterClient
                          maxYear={gregorianYearToHijriYear(
                            new Date().getFullYear(),
                          )}
                          defaultRange={year}
                        />
                      ) : null}

                      {type === "texts" || type === "authors" ? (
                        <RegionsFilter
                          currentRegions={regions}
                          filters={{
                            yearRange: year,
                          }}
                        />
                      ) : null}

                      {type === "texts" ? (
                        <AuthorsFilter
                          currentAuthors={authors}
                          selectedAuthorsResponse={
                            (results as any).selectedAuthors
                          }
                          filters={{
                            yearRange: year,
                            regions,
                          }}
                        />
                      ) : null}

                      {type === "texts" ? (
                        <GenresFilter
                          currentGenres={genres}
                          filters={{
                            yearRange: year,
                          }}
                        />
                      ) : null}
                    </>
                  )
                }
              />
            )
          ) : (
            <p>error</p>
          )}
        </Container>
      )}
    </>
  );
}

export default withParamValidation(SearchPage, Route);

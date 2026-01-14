import type { View } from "@/validation/view";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorSearchResult from "@/components/author-search-result";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import EmpireSearchResult from "@/components/empire-search-result";
import GenreSearchResult from "@/components/genre-search-result";
import GenresFilter from "@/components/genres-filter";
import RegionSearchResult from "@/components/region-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import Container from "@/components/ui/container";
import YearFilterClient from "@/components/year-filter/client";
import {
  searchAdvancedGenres,
  searchAuthors,
  searchBooks,
  searchContent,
  searchCorpus,
  searchEmpires,
  searchRegions,
} from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { booksSorts, yearsSorts } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType, SearchType } from "./routeType";
import AllSearchResults from "./all-search-results";
import { BookContentResult } from "./book-content-result";
import ContentFilters from "./content-filters";
import ContentSearchType from "./content-search-type";
import EmptyState from "./empty-state";
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
        advancedGenres: genres,
        authors: authors,
        regions: regions,
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

  if (type === "genres") return searchAdvancedGenres(q, commonOptions);

  if (type === "regions") return searchRegions(q, commonOptions);

  if (type === "empires") return searchEmpires(q, commonOptions);

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
  if (type === "regions") return <RegionSearchResult result={result} />;
  if (type === "empires") return <EmpireSearchResult result={result} />;
  if (type === "content")
    return <BookContentResult result={result} className="w-full" />;

  return <RegionSearchResult result={result} />;
};

async function SearchPage({ searchParams }: TextsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { type, q, sort, genres, authors, regions, year, view, searchType } =
    resolvedSearchParams;

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
        empires: "entities.empires",
        all: "entities.texts",
      } as const
    )[type],
  );

  const showEmptyState = q.trim().length === 0;
  const total =
    "pagination" in results
      ? results.pagination.totalRecords
      : "total" in results
        ? results.total
        : 0;

  return (
    <>
      <Container>
        <SearchInput />
        {!showEmptyState && <SearchTypeSwitcher />}
        {showEmptyState && <EmptyState />}
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
                  <div className="flex items-center justify-between">
                    <p>{t("entities.x-results", { count: total })}</p>
                    {type === "content" && <ContentSearchType />}
                  </div>
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
                  ) : type === "genres" ||
                    type === "regions" ||
                    type === "empires" ? null : (
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

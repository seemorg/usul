import type { View } from "@/validation/view";
import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import AuthorSearchResult from "@/components/author-search-result";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import Footer from "@/components/footer";
import GenreSearchResult from "@/components/genre-search-result";
import GenresFilter from "@/components/genres-filter";
import GlobalSearchResult from "@/components/global-search-result";
import Navbar from "@/components/navbar";
import RegionSearchResult from "@/components/region-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import DottedList from "@/components/ui/dotted-list";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import YearFilterClient from "@/components/year-filter/client";
import {
  searchAllCollections,
  searchAuthors,
  searchBooks,
  searchCorpus,
  searchGenres,
  searchRegions,
} from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { booksSorts, navigation, yearsSorts } from "@/lib/urls";
import { Link } from "@/navigation";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType, SearchType } from "./routeType";
import AllSearchResults from "./all-search-results";
import { Route } from "./routeType";
import SearchCarousel from "./search-carousel";
import SearchInput from "./search-input";
import SearchTypeSwitcher from "./search-type-switcher";

type TextsPageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("common"))("search"),
    pagePath: navigation.search.normal(),
    locale,
  });
}

async function search(params: Awaited<TextsPageProps["searchParams"]>) {
  const pathLocale = await getPathLocale();
  const { type, q, sort, page, genres, authors, regions, year } = params;

  const commonOptions = {
    limit: 20,
    page,
    locale: pathLocale,
  };

  if (type === "all") {
    return searchCorpus(q, pathLocale);
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

  // type === "regions"
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
  if (type === "texts") {
    return <BookSearchResult result={result} view={view} />;
  }

  if (type === "authors") {
    return <AuthorSearchResult result={result} />;
  }

  if (type === "genres") {
    return <GenreSearchResult result={result} />;
  }

  // type === "regions"
  return <RegionSearchResult result={result} />;
};

async function SearchPage({ searchParams }: TextsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { type, q, sort, genres, authors, regions, year, view } =
    resolvedSearchParams;
  const pathLocale = await getPathLocale();
  const t = await getTranslations();

  const results = await search(resolvedSearchParams);
  // const results = await searchCorpus(q, pathLocale);

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

  return (
    <div>
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col pt-16 pb-24 sm:pt-24">
        <Container className="flex flex-col items-center">
          <SearchInput initialValue={q} />

          <SearchTypeSwitcher />

          <div className="mt-5" />

          {!results && <p>error</p>}

          {results ? (
            "content" in results ? (
              <AllSearchResults results={results} q={q} />
            ) : (
              <SearchResults
                showInput={false}
                response={results.results as any}
                pagination={results.pagination}
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
                  type === "genres" || type === "regions" ? null : (
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
      </main>

      <Footer />
    </div>
  );
}

export default withParamValidation(SearchPage, Route);

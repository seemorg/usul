import type { View } from "@/validation/view";
import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import AuthorSearchResult from "@/components/author-search-result";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import GenreSearchResult from "@/components/genre-search-result";
import GenresFilter from "@/components/genres-filter";
import GlobalSearchResult from "@/components/global-search-result";
import RegionSearchResult from "@/components/region-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import Container from "@/components/ui/container";
import YearFilterClient from "@/components/year-filter/client";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getMetadata } from "@/lib/seo";
import { booksSorts, navigation, yearsSorts } from "@/lib/urls";
import { searchAuthors } from "@/server/typesense/author";
import { searchBooks } from "@/server/typesense/book";
import { searchGenres } from "@/server/typesense/genre";
import { searchAllCollections } from "@/server/typesense/global";
import { searchRegions } from "@/server/typesense/region";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType, SearchType } from "./routeType";
import { Route } from "./routeType";
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
  const { type, q, sort, page, genres, authors, regions, year } = params;

  if (type === "all") {
    return searchAllCollections(q, {
      limit: 20,
      page,
    });
  }

  if (type === "texts") {
    return searchBooks(q, {
      limit: 20,
      page,
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
      limit: 20,
      page,
      sortBy: sort,
      filters: {
        yearRange: year,
        regions,
      },
    });
  }

  if (type === "genres")
    return searchGenres(q, {
      limit: 20,
      page,
    });

  // type === "regions"
  return searchRegions(q, {
    limit: 20,
    page,
  });
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
  if (type === "all") {
    return <GlobalSearchResult result={result} />;
  }

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
  const t = await getTranslations();

  const results = await search(resolvedSearchParams);

  const entityName = t(
    (
      {
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

      <main className="bg-background flex min-h-screen w-full flex-col pb-24">
        <div className="bg-muted-primary flex h-[250px] w-full items-center justify-center pt-16 text-white sm:h-[300px] sm:pt-24">
          <Container className="flex flex-col items-center">
            <h1 className="text-6xl font-bold sm:text-7xl">
              {t("common.advanced-search")}
            </h1>

            {/* <p className="mt-5 text-lg text-secondary dark:text-gray-300">
            {t("search-x", {
              count: totalBooks,
              entity: t("texts"),
            })}
          </p> */}
            <SearchTypeSwitcher />
          </Container>
        </div>

        <Container className="bg-background mt-10 sm:mt-20">
          <SearchResults
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
              type === "authors" || type === "texts" || type === "all"
                ? yearsSorts
                : booksSorts
            }
            currentSort={sort}
            currentQuery={q}
            view={view}
            filters={
              type === "all" ||
              type === "genres" ||
              type === "regions" ? null : (
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
                      selectedAuthorsResponse={(results as any).selectedAuthors}
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
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default withParamValidation(SearchPage, Route);

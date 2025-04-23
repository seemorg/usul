import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type SearchType, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { navigation, yearsSorts } from "@/lib/urls";
import RegionsFilter from "@/components/regions-filter";
import AuthorsFilter from "@/components/authors-filter";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getTranslations } from "next-intl/server";

import { getMetadata } from "@/lib/seo";
import Container from "@/components/ui/container";
import { searchAllCollections } from "@/server/typesense/global";
import { searchAuthors } from "@/server/typesense/author";
import { searchGenres } from "@/server/typesense/genre";
import AuthorSearchResult from "@/components/author-search-result";
import type { View } from "@/validation/view";
import GenreSearchResult from "@/components/genre-search-result";
import RegionSearchResult from "@/components/region-search-result";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";
import SearchTypeSwitcher from "./search-type-switcher";
import GlobalSearchResult from "@/components/global-search-result";
import { Locale } from "next-intl";
import YearFilterClient from "@/components/year-filter/client";

type TextsPageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("entities"))("texts"),
    pagePath: navigation.books.all(),
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
      sortBy: sort.typesenseValue,
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
      sortBy: sort.typesenseValue,
      filters: {
        yearRange: year,
        regions,
      },
    });
  }

  // if (type === "genres")
  return searchGenres(q, {
    limit: 20,
    page,
    // sortBy: sort,
  });
}

// eslint-disable-next-line react/display-name
const renderResult = (type: SearchType, view: View) => (result: any) => {
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

  if (type === "regions") {
    return <RegionSearchResult result={result} />;
  }
};

async function SearchPage({ searchParams }: TextsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { type, q, sort, genres, authors, regions, year, view } =
    resolvedSearchParams;
  const t = await getTranslations("entities");

  const results = await search(resolvedSearchParams);

  return (
    <div>
      <Navbar />

      <main className="flex min-h-screen w-full flex-col bg-background pb-24">
        <div className="flex h-[250px] w-full items-center justify-center bg-muted-primary pt-16 text-white sm:h-[300px] sm:pt-24">
          <Container className="flex flex-col items-center">
            <h1 className="text-6xl font-bold sm:text-7xl">{t("texts")}</h1>

            {/* <p className="mt-5 text-lg text-secondary dark:text-gray-300">
            {t("search-x", {
              count: totalBooks,
              entity: t("texts"),
            })}
          </p> */}
            <SearchTypeSwitcher />
          </Container>
        </div>

        <Container className="mt-10 bg-background sm:mt-20">
          <SearchResults
            response={results.results as any}
            pagination={results.pagination}
            renderResult={renderResult(type, view) as any}
            emptyMessage={t("no-entity", { entity: t("texts") })}
            placeholder={t("search-within", {
              entity: t("texts"),
            })}
            sorts={yearsSorts as any}
            currentSort={sort.raw}
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

import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/lib/search";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts } from "@/lib/urls";
import RegionsFilter from "@/components/regions-filter";
import AuthorsFilter from "@/components/authors-filter";
import YearFilter from "@/components/year-filter";
import { gregorianYearToHijriYear } from "@/lib/date";
import { countAllBooks } from "@/server/services/books";
import RootEntityPage from "../root-entity-page";

type TextsPageProps = InferPagePropsType<RouteType>;

export const metadata = {
  title: "All Texts",
};

async function TextsPage({ searchParams }: TextsPageProps) {
  const { q, sort, page, genres, authors, regions, year, view } = searchParams;

  const [results, totalBooks] = await Promise.all([
    searchBooks(q, {
      limit: 20,
      page,
      sortBy: sort,
      filters: {
        genres,
        authors,
        regions,
        yearRange: year,
      },
    }),
    countAllBooks(),
  ]);

  return (
    <RootEntityPage title="Texts" description={`Search ${totalBooks} texts`}>
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => (
          <BookSearchResult result={result} view={view} />
        )}
        emptyMessage="No books found"
        sorts={booksSorts as any}
        placeholder={`Search within Texts...`}
        currentSort={sort}
        currentQuery={q}
        view={view}
        filters={
          <>
            <YearFilter
              maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
              defaultRange={year}
            />

            <RegionsFilter
              currentRegions={regions}
              filters={{
                yearRange: year,
              }}
            />

            <AuthorsFilter
              currentAuthors={authors}
              selectedAuthorsResponse={results.selectedAuthors}
              filters={{
                yearRange: year,
                regions,
              }}
            />

            <GenresFilter
              currentGenres={genres}
              filters={{
                yearRange: year,
              }}
            />
          </>
        }
      />
    </RootEntityPage>
  );
}

export default withParamValidation(TextsPage, Route);

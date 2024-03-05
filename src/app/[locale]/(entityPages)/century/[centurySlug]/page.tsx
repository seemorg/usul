import { searchBooks } from "@/lib/search";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import SearchResults from "@/components/search-results";
import { yearsSorts } from "@/lib/urls";
import BookSearchResult from "@/components/book-search-result";
import { findYearRangeBySlug } from "@/server/services/years";
import AuthorsFilter from "@/components/authors-filter";
import { getNumberWithOrdinal } from "@/lib/number";
import RegionsFilter from "@/components/regions-filter";
import GenresFilter from "@/components/genres-filter";
import TruncatedText from "@/components/ui/truncated-text";
import { getMetadata } from "@/lib/seo";

type CenturyPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { centurySlug },
}: {
  params: { centurySlug: string };
}) => {
  const yearRange = findYearRangeBySlug(centurySlug);
  if (!yearRange) return;

  return getMetadata({
    title: `${getNumberWithOrdinal(yearRange.centuryNumber)} Century AH`,
  });
};

async function CenturyPage({
  routeParams: { centurySlug },
  searchParams,
}: CenturyPageProps) {
  const yearRange = findYearRangeBySlug(centurySlug);

  if (!yearRange) {
    notFound();
  }

  const { q, sort, page, authors, regions, genres } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      yearRange: [yearRange.yearFrom, yearRange.yearTo],
      authors,
      regions,
      genres,
    },
  });

  const primaryName = `${getNumberWithOrdinal(yearRange.centuryNumber)} Century AH`;
  const secondaryName = null;

  return (
    <div>
      <h1 className="text-5xl font-bold sm:text-7xl">{primaryName}</h1>
      {secondaryName && (
        <h2 className="mt-5 text-3xl font-medium sm:text-5xl">
          {secondaryName}
        </h2>
      )}

      <div className="mt-14 flex w-full items-center">
        <p>{results.results.found} Texts</p>
      </div>

      {yearRange.description && (
        <TruncatedText className="mt-6 text-lg">
          {yearRange.description}
        </TruncatedText>
      )}

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => <BookSearchResult result={result} />}
          emptyMessage="No books found"
          sorts={yearsSorts as any}
          placeholder={`Search within ${primaryName}...`}
          currentSort={sort.raw}
          currentQuery={q}
          filters={
            <>
              <RegionsFilter
                currentRegions={regions}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />

              <GenresFilter
                currentGenres={genres}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(CenturyPage, Route);

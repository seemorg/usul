import BookSearchResult from "@/components/book-search-result";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/lib/search";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts } from "@/lib/urls";
import { findGenreBySlug } from "@/server/services/genres";
import AuthorsFilter from "@/components/authors-filter";
import dynamic from "next/dynamic";
import YearFilterSkeleton from "@/components/year-filter-skeleton";
import { gregorianYearToHijriYear } from "@/lib/date";
import RegionsFilter from "@/components/regions-filter";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

type GenrePageProps = InferPagePropsType<RouteType>;

async function GenrePage({
  routeParams: { genreSlug },
  searchParams,
}: GenrePageProps) {
  const genre = await findGenreBySlug(genreSlug);

  if (!genre) {
    notFound();
  }

  const { q, sort, page, authors, regions, year } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    filters: {
      genres: [genre.genre.id],
      regions,
      authors,
      yearRange: year,
    },
  });

  const primaryName = genre.genre.name;
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
        <p>{genre.count} Texts</p>
      </div>

      {/* {author.bio && (
        <div className="mt-6 text-lg">
          <p>{author.bio}</p>
        </div>
      )} */}

      <div className="mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => <BookSearchResult result={result} />}
          emptyMessage="No books found"
          sorts={booksSorts as any}
          placeholder={`Search within ${primaryName}...`}
          currentSort={sort}
          currentQuery={q}
          filters={
            <>
              <YearFilter
                maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
                defaultRange={year}
              />

              <RegionsFilter
                currentRegions={regions}
                filters={{
                  genreId: genre.genre.id,
                }}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(GenrePage, Route);

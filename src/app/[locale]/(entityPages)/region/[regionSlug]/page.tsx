import { searchBooks } from "@/lib/search";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { findRegionBySlug } from "@/server/services/regions";
import SearchResults from "@/components/search-results";
import { yearsSorts } from "@/lib/urls";
import BookSearchResult from "@/components/book-search-result";
import AuthorsFilter from "@/components/authors-filter";
import dynamic from "next/dynamic";
import { gregorianYearToHijriYear } from "@/lib/date";
import YearFilterSkeleton from "@/components/year-filter-skeleton";
import GenresFilter from "@/components/genres-filter";
import TruncatedText from "@/components/ui/truncated-text";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

type RegionPageProps = InferPagePropsType<RouteType>;

async function RegionPage({
  routeParams: { regionSlug },
  searchParams,
}: RegionPageProps) {
  const region = await findRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  const { q, sort, page, year, authors, genres } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      regions: [region.region.slug],
      yearRange: year,
      genres,
    },
  });

  const primaryName = region.region.code;
  const secondaryName = region.region.nameArabic;

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

        <span className="mx-3 text-muted-foreground">•</span>
        <p>Includes ({region.subLocationsCount} Locations)</p>
      </div>

      {region.region.overview && (
        <TruncatedText className="mt-6 text-lg">
          {region.region.overview}
        </TruncatedText>
      )}

      <div className="mt-16">
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
              <YearFilter
                maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
                defaultRange={year}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
                filters={{
                  regions: [region.region.slug],
                }}
              />

              <GenresFilter
                currentGenres={genres}
                filters={{
                  regionCode: region.region.code,
                }}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(RegionPage, Route);

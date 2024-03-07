import SearchResults from "@/components/search-results";
import { Route, sorts, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import dynamic from "next/dynamic";
import YearFilterSkeleton from "@/components/year-filter-skeleton";
import { searchAuthors } from "@/lib/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import AuthorSearchResult from "@/components/author-search-result";
import RegionsFilter from "@/components/regions-filter";
import { countAllAuthors } from "@/server/services/authors";
import RootEntityPage from "../root-entity-page";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

type PageProps = InferPagePropsType<RouteType>;

export const metadata = {
  title: "All Authors",
};

async function AuthorsPage({ searchParams }: PageProps) {
  const { q, sort, page, year, regions } = searchParams;

  const [results, totalAuthors] = await Promise.all([
    searchAuthors(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
      filters: {
        yearRange: year,
        regions,
      },
    }),
    countAllAuthors(),
  ]);

  return (
    <RootEntityPage
      title="Authors"
      description={`Search over ${totalAuthors} authors`}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <AuthorSearchResult result={result} />}
        emptyMessage="No books found"
        sorts={sorts as any}
        placeholder={`Search within Authors...`}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentSort={sort.raw}
        currentQuery={q}
        filters={
          <>
            <YearFilter
              defaultRange={year}
              maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
            />

            <RegionsFilter currentRegions={regions} countType="authors" />
          </>
        }
      />
    </RootEntityPage>
  );
}

export default withParamValidation(AuthorsPage, Route);

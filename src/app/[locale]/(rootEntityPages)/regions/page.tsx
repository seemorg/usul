import RegionSearchResult from "@/components/region-search-result";
import SearchResults from "@/components/search-results";
import { countAllRegions } from "@/server/services/regions";
import type { InferPagePropsType } from "next-typesafe-url";
import { Route, sorts, type RouteType } from "./routeType";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { searchRegions } from "@/server/typesense/region";
import RootEntityPage from "../root-entity-page";

type PageProps = InferPagePropsType<RouteType>;

export const metadata = {
  title: "All Regions",
};

async function RegionsPage({ searchParams }: PageProps) {
  const { q, page, sort } = searchParams;

  const [results, totalRegions] = await Promise.all([
    searchRegions(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
    }),
    countAllRegions(),
  ]);

  return (
    <RootEntityPage
      title="Regions"
      description={`Search over ${totalRegions} regions`}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <RegionSearchResult result={result} />}
        emptyMessage="No regions found"
        sorts={sorts as any}
        currentSort={sort.raw}
        placeholder={`Search within Regions...`}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(RegionsPage, Route);

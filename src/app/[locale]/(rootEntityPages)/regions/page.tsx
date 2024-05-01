import RegionSearchResult from "@/components/region-search-result";
import SearchResults from "@/components/search-results";
import { countAllRegions } from "@/server/services/regions";
import type { InferPagePropsType } from "next-typesafe-url";
import { Route, sorts, type RouteType } from "./routeType";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { searchRegions } from "@/server/typesense/region";
import RootEntityPage from "../root-entity-page";
import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";

type PageProps = InferPagePropsType<RouteType>;

export async function generateMetadata() {
  return getMetadata({
    title: (await getTranslations("entities"))("regions"),
  });
}

async function RegionsPage({ searchParams }: PageProps) {
  const { q, page, sort } = searchParams;

  const t = await getTranslations("entities");

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
      title={t("regions")}
      description={t("search-x", {
        count: totalRegions,
        entity: t("regions"),
      })}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <RegionSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("regions") })}
        placeholder={t("search-within", {
          entity: t("regions"),
        })}
        sorts={sorts as any}
        currentSort={sort.raw}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(RegionsPage, Route);

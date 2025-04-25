import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import RegionSearchResult from "@/components/region-search-result";
import SearchResults from "@/components/search-results";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { countAllRegions } from "@/server/services/regions";
import { searchRegions } from "@/server/typesense/region";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import RootEntityPage from "../root-entity-page";
import { Route, sorts } from "./routeType";

type PageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("entities"))("regions"),
    pagePath: navigation.regions.all(),
    locale,
  });
}

async function RegionsPage({ searchParams }: PageProps) {
  const { q, page, sort } = await searchParams;

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
      <p className="-mt-14 mb-12 flex items-center">
        <InfoIcon className="mr-1 size-4 rtl:ml-1" />
        Regions on Usul are based on the&nbsp;
        <a
          href="https://althurayya.github.io/"
          target="_blank"
          className="underline"
        >
          Turayya project
        </a>
      </p>

      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <RegionSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("regions") })}
        placeholder={t("search-within", {
          entity: t("regions"),
        })}
        hasViews={false}
        sorts={sorts as any}
        currentSort={sort.raw}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(RegionsPage, Route);

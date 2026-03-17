import type { HierarchicalItem } from "@/components/hierarchical-list-view";
import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import RegionsChoroplethMap from "@/components/regions-choropleth-map/client";
import RegionsHierarchyView from "./hierarchy-view";
import { getTotalEntities } from "@/lib/api";
import { findAllRegionsWithBooksCount, getRegionHierarchy } from "@/lib/api/regions";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import RootEntityPage from "../root-entity-page";
import { Route } from "./routeType";

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
  const { q } = await searchParams;
  const pathLocale = await getPathLocale();
  const t = await getTranslations("entities");

  const [total, hierarchy, regions] = await Promise.all([
    getTotalEntities(),
    getRegionHierarchy(pathLocale),
    findAllRegionsWithBooksCount(undefined, pathLocale),
  ]);

  return (
    <RootEntityPage
      title={t("regions")}
      subtitle={t("search-x", {
        count: total.regions,
        entity: t("regions"),
      })}
      description={t("regions-description")}
    >
      <RegionsChoroplethMap data={regions as any} />

      <div className="mt-8">
        <RegionsHierarchyView
          hierarchy={hierarchy as (HierarchicalItem & { numberOfAuthors: number; numberOfBooks: number })[]}
          searchQuery={q}
          placeholder={t("search-within", {
            entity: t("regions"),
          })}
        />
      </div>
    </RootEntityPage>
  );
}

export default withParamValidation(RegionsPage, Route);

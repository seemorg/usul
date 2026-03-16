import type { HierarchicalItem } from "@/components/hierarchical-list-view";
import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import EmpiresHierarchyView from "./hierarchy-view";
import { getTotalEntities } from "@/lib/api";
import { getEmpireHierarchy } from "@/lib/api/empires";
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
    title: (await getTranslations("entities"))("empires"),
    pagePath: navigation.empires.all(),
    locale,
  });
}

async function EmpiresPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const pathLocale = await getPathLocale();
  const t = await getTranslations("entities");

  const [total, hierarchy] = await Promise.all([
    getTotalEntities(),
    getEmpireHierarchy(pathLocale),
  ]);

  return (
    <RootEntityPage
      title={t("empires")}
      subtitle={t("search-x", {
        count: total.empires,
        entity: t("empires"),
      })}
      description={t("empires-description")}
    >
      <EmpiresHierarchyView
        hierarchy={hierarchy as (HierarchicalItem & { numberOfAuthors: number; numberOfBooks: number })[]}
        searchQuery={q}
        placeholder={t("search-within", {
          entity: t("empires"),
        })}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(EmpiresPage, Route);

import type { HierarchicalGenre } from "@/components/hierarchical-genre-view";
import type { GenreNode } from "@/types/genre";
import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import GenreTreeChart from "@/components/genres-tree-chart/client";
import HierarchicalGenreView from "@/components/hierarchical-genre-view";
import { getTotalEntities } from "@/lib/api";
import { getAdvancedGenreHierarchy } from "@/lib/api/advanced-genres";
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
    title: (await getTranslations("entities"))("genres"),
    pagePath: navigation.genres.all(),
    locale,
  });
}

async function GenresPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const t = await getTranslations("entities");
  const pathLocale = await getPathLocale();

  const [total, hierarchy] = await Promise.all([
    getTotalEntities(),
    getAdvancedGenreHierarchy({ locale: pathLocale }),
  ]);

  const genreHierarchy = (hierarchy ?? []) as GenreNode[];

  return (
    <RootEntityPage
      title={t("genres")}
      description={t("search-x", {
        count: total.advancedGenres,
        entity: t("genres"),
      })}
    >
      <GenreTreeChart data={genreHierarchy} />
      <div className="mt-8">
        <HierarchicalGenreView
          hierarchy={genreHierarchy as HierarchicalGenre[]}
          searchQuery={q}
          placeholder={t("search-within", {
            entity: t("genres"),
          })}
        />
      </div>
    </RootEntityPage>
  );
}

export default withParamValidation(GenresPage, Route);

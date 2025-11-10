import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import GenreSearchResult from "@/components/genre-search-result";
import GenreTreeChart from "@/components/genres-tree-chart/client";
import SearchResults from "@/components/search-results";
import { getTotalEntities } from "@/lib/api";
import { getAdvancedGenreHierarchy } from "@/lib/api/advanced-genres";
import { searchAdvancedGenres } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { alphabeticalSorts, navigation } from "@/lib/urls";
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
    title: (await getTranslations("entities"))("genres"),
    pagePath: navigation.genres.all(),
    locale,
  });
}

async function GenresPage({ searchParams }: PageProps) {
  const { q, sort, page } = await searchParams;

  const t = await getTranslations("entities");
  const pathLocale = await getPathLocale();

  const [results, total, hierarchy] = await Promise.all([
    searchAdvancedGenres(q, {
      limit: 20,
      locale: pathLocale,
      page,
      sortBy: sort,
    }),
    getTotalEntities(),
    getAdvancedGenreHierarchy({ locale: pathLocale }),
  ]);

  return (
    <RootEntityPage
      title={t("genres")}
      description={t("search-x", {
        count: total.advancedGenres,
        entity: t("genres"),
      })}
    >
      <GenreTreeChart data={hierarchy as any} />
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <GenreSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("genres") })}
        placeholder={t("search-within", {
          entity: t("genres"),
        })}
        hasViews={false}
        sorts={pathLocale === "en" ? [...sorts, ...alphabeticalSorts] : sorts}
        currentSort={sort}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(GenresPage, Route);

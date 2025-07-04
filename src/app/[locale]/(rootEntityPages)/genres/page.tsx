import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import GenreSearchResult from "@/components/genre-search-result";
import SearchResults from "@/components/search-results";
import { searchGenres } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { countAllGenres } from "@/server/services/genres";
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

  const [results, totalGenres] = await Promise.all([
    searchGenres(q, {
      limit: 20,
      locale: pathLocale,
      page,
      sortBy: sort,
    }),
    countAllGenres(),
  ]);

  return (
    <RootEntityPage
      title={t("genres")}
      description={t("search-x", {
        count: totalGenres,
        entity: t("genres"),
      })}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <GenreSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("genres") })}
        placeholder={t("search-within", {
          entity: t("genres"),
        })}
        hasViews={false}
        sorts={sorts}
        currentSort={sort}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(GenresPage, Route);

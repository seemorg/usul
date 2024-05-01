import { countAllGenres } from "@/server/services/genres";
import type { InferPagePropsType } from "next-typesafe-url";
import { Route, sorts, type RouteType } from "./routeType";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import SearchResults from "@/components/search-results";
import GenreSearchResult from "@/components/genre-search-result";
import { searchGenres } from "@/server/typesense/genre";
import RootEntityPage from "../root-entity-page";
import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";

type PageProps = InferPagePropsType<RouteType>;

export async function generateMetadata() {
  return getMetadata({
    title: (await getTranslations("entities"))("genres"),
  });
}

async function GenresPage({ searchParams }: PageProps) {
  const { q, sort, page } = searchParams;

  const t = await getTranslations("entities");

  const [results, totalGenres] = await Promise.all([
    searchGenres(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
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
        sorts={sorts as any}
        currentSort={sort.raw}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(GenresPage, Route);

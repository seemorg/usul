import { countAllGenres } from "@/server/services/genres";
import type { InferPagePropsType } from "next-typesafe-url";
import { Route, sorts, type RouteType } from "./routeType";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import SearchResults from "@/components/search-results";
import GenreSearchResult from "@/components/genre-search-result";
import { searchGenres } from "@/server/typesense/genre";
import RootEntityPage from "../root-entity-page";

type PageProps = InferPagePropsType<RouteType>;

export const metadata = {
  title: "All Genres",
};

async function GenresPage({ searchParams }: PageProps) {
  const { q, sort, page } = searchParams;

  const [results, totalGenres] = await Promise.all([
    searchGenres(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
    }),
    countAllGenres(),
  ]);

  return (
    <RootEntityPage title="Genres" description={`Search ${totalGenres} genres`}>
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <GenreSearchResult result={result} />}
        emptyMessage="No genres found"
        sorts={sorts as any}
        currentSort={sort.raw}
        placeholder={`Search within Genres...`}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(GenresPage, Route);

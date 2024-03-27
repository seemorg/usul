import { searchBooks } from "@/server/typesense/book";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import SearchResults from "@/components/search-results";
import { yearsSorts } from "@/lib/urls";
import BookSearchResult from "@/components/book-search-result";
import { findYearRangeBySlug } from "@/server/services/years";
import AuthorsFilter from "@/components/authors-filter";
import RegionsFilter from "@/components/regions-filter";
import GenresFilter from "@/components/genres-filter";
import TruncatedText from "@/components/ui/truncated-text";
import { getTranslations } from "next-intl/server";

type CenturyPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { centurySlug },
}: {
  params: { centurySlug: string };
}) => {
  const yearRange = await findYearRangeBySlug(centurySlug);
  if (!yearRange) return;

  const t = await getTranslations();

  return {
    title: `${t("entities.ordinal-century", { count: yearRange.centuryNumber })} ${t("common.year-format.ah.title")}`,
  };
};

async function CenturyPage({
  routeParams: { centurySlug },
  searchParams,
}: CenturyPageProps) {
  const yearRange = await findYearRangeBySlug(centurySlug);

  if (!yearRange) {
    notFound();
  }

  const t = await getTranslations();

  const { q, sort, page, authors, regions, genres, view } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      yearRange: [yearRange.yearFrom, yearRange.yearTo],
      authors,
      regions,
      genres,
    },
  });

  const primaryName = `${t("entities.ordinal-century", { count: yearRange.centuryNumber })} ${t("common.year-format.ah.title")}`;
  const secondaryName = null;

  return (
    <div>
      <h1 className="text-5xl font-bold sm:text-7xl">{primaryName}</h1>

      {secondaryName && (
        <h2 className="mt-5 text-3xl font-medium sm:text-5xl">
          {secondaryName}
        </h2>
      )}

      <div className="mt-9 flex w-full items-center sm:mt-14">
        <p>{t("entities.x-texts", { count: yearRange.totalBooks })}</p>
      </div>

      {yearRange.description && (
        <TruncatedText className="mt-7 text-lg">
          {yearRange.description}
        </TruncatedText>
      )}

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => (
            <BookSearchResult result={result} view={view} />
          )}
          emptyMessage={t("entities.no-entity", {
            entity: t("entities.texts"),
          })}
          placeholder={t("entities.search-within", {
            entity: primaryName,
          })}
          sorts={yearsSorts as any}
          currentSort={sort.raw}
          currentQuery={q}
          view={view}
          filters={
            <>
              <RegionsFilter
                currentRegions={regions}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />

              <GenresFilter
                currentGenres={genres}
                filters={{
                  yearRange: [yearRange.yearFrom, yearRange.yearTo],
                }}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(CenturyPage, Route);

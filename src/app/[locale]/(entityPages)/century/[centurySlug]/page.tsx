import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import TruncatedText from "@/components/ui/truncated-text";
import { getMetadata } from "@/lib/seo";
import { navigation, yearsSorts } from "@/lib/urls";
import { findYearRangeBySlug } from "@/server/services/years";
import { searchBooks } from "@/server/typesense/book";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";

type CenturyPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ centurySlug: string; locale: Locale }>;
}) => {
  const { centurySlug, locale } = await params;

  const yearRange = await findYearRangeBySlug(centurySlug);
  if (!yearRange) return;

  const t = await getTranslations();
  const title = `${t("entities.ordinal-century", { count: yearRange.centuryNumber })} ${t("common.year-format.ah.title")}`;

  return getMetadata({
    image: {
      url: `/api/og/century/${centurySlug}`,
      width: 1200,
      height: 720,
    },
    locale,
    pagePath: navigation.centuries.byNumber(yearRange.centuryNumber),
    title,
    description: yearRange.description,
  });
};

async function CenturyPage({ routeParams, searchParams }: CenturyPageProps) {
  const { centurySlug } = await routeParams;
  const yearRange = await findYearRangeBySlug(centurySlug);

  if (!yearRange) {
    notFound();
  }

  const t = await getTranslations();

  const { q, sort, page, authors, regions, genres, view } = await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
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
      <h1 className="text-3xl font-bold md:text-4xl lg:text-7xl">
        {primaryName}
      </h1>

      {secondaryName && (
        <h2 className="mt-5 text-xl font-medium sm:text-2xl md:text-3xl lg:text-5xl">
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
          sorts={yearsSorts}
          currentSort={sort}
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

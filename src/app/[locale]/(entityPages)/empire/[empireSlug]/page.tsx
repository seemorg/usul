import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import DottedList from "@/components/ui/dotted-list";
import TruncatedText from "@/components/ui/truncated-text";
import YearFilterClient from "@/components/year-filter/client";
import { findEmpireBySlug } from "@/lib/api/empires";
import { searchBooks } from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { alphabeticalSorts, navigation, yearsSorts } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ empireSlug: string; locale: Locale }>;
}) => {
  const { empireSlug, locale } = await params;

  const pathLocale = await getPathLocale();

  const empire = await findEmpireBySlug(empireSlug, pathLocale);
  if (!empire) return {};

  return getMetadata({
    locale,
    image: {
      url: `/api/og/empire/${empireSlug}`,
      width: 1200,
      height: 720,
    },
    pagePath: navigation.empires.bySlug(empireSlug),
    title: empire.name,
    description: empire.overview,
  });
};

type EmpirePageProps = InferPagePropsType<RouteType>;

async function EmpirePage({ routeParams, searchParams }: EmpirePageProps) {
  const { empireSlug } = await routeParams;
  const pathLocale = await getPathLocale();
  const empire = await findEmpireBySlug(empireSlug, pathLocale);

  if (!empire) {
    notFound();
  }

  const t = await getTranslations();

  const { q, sort, page, year, regions, authors, genres, view } =
    await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    locale: pathLocale,
    filters: {
      empires: [empire.slug],
      // TODO: Add regions filter
      regions: regions,
      yearRange: year,
      advancedGenres: genres,
      authors: authors,
    },
  });

  const primaryName = empire.name;
  const secondaryName = empire.secondaryName;

  const overview = empire.overview;

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

      <DottedList
        className="mt-9 sm:mt-14"
        items={[
          <p>{t("entities.x-texts", { count: results.results.found })}</p>,
          <div className="flex items-center">
            {/* <p className="capitalize">{t("common.includes")} &nbsp;</p> */}
          </div>,
        ]}
      />

      {overview && (
        <TruncatedText className="mt-7 text-lg">{overview}</TruncatedText>
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
            entity: t("entities.empire"),
          })}
          sorts={
            pathLocale === "en"
              ? [...yearsSorts, ...alphabeticalSorts]
              : yearsSorts
          }
          currentSort={sort}
          currentQuery={q}
          view={view}
          filters={
            <>
              <YearFilterClient
                maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
                defaultRange={year}
              />

              <RegionsFilter
                currentRegions={regions}
                // filters={{
                //   empires: [empire.slug],
                // }}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
                filters={{
                  empires: [empire.slug],
                }}
              />

              <GenresFilter
                currentGenres={genres}
                // filters={{
                //   empireId: empire.id,
                // }}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(EmpirePage, Route);

import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import DottedList from "@/components/ui/dotted-list";
import { ExpandibleList } from "@/components/ui/expandible-list";
import TruncatedText from "@/components/ui/truncated-text";
import YearFilterClient from "@/components/year-filter/client";
import { findRegionBySlug } from "@/lib/api/regions";
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
  params: Promise<{ regionSlug: string; locale: Locale }>;
}) => {
  const { regionSlug, locale } = await params;

  const pathLocale = await getPathLocale();

  const region = await findRegionBySlug(regionSlug, pathLocale);
  if (!region) return {};

  return getMetadata({
    locale,
    image: {
      url: `/api/og/region/${regionSlug}`,
      width: 1200,
      height: 720,
    },
    pagePath: navigation.regions.bySlug(regionSlug),
    title: region.name,
    description: region.overview,
  });
};

type RegionPageProps = InferPagePropsType<RouteType>;

async function RegionPage({ routeParams, searchParams }: RegionPageProps) {
  const { regionSlug } = await routeParams;
  const pathLocale = await getPathLocale();
  const region = await findRegionBySlug(regionSlug, pathLocale);

  if (!region) {
    notFound();
  }

  const t = await getTranslations();

  const { q, sort, page, year, authors, genres, view } = await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    locale: pathLocale,
    filters: {
      regions: [region.slug],
      yearRange: year,
      advancedGenres: genres,
      authors: authors,
    },
  });

  const primaryName = region.name;
  const secondaryName = region.secondaryName;

  const overview = region.overview;

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

      {/* Locations */}
      {/* <DottedList
        className="mt-9 sm:mt-14"
        items={[
          <p>{t("entities.x-texts", { count: results.results.found })}</p>,
          <div className="flex items-center">
            <p className="capitalize">{t("common.includes")} &nbsp;</p>

            <ExpandibleList
              items={cities}
              noun={{
                singular: t("entities.location"),
                plural: t("entities.locations"),
              }}
            />
          </div>,
        ]}
      /> */}

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
            entity: t("entities.region"),
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

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
                filters={{
                  regions: [region.slug],
                }}
              />

              <GenresFilter
                currentGenres={genres}
                filters={{
                  regionId: region.id,
                }}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(RegionPage, Route);

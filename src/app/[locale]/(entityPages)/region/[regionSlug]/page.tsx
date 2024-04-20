/* eslint-disable react/jsx-key */
import { searchBooks } from "@/server/typesense/book";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { findRegionBySlug } from "@/server/services/regions";
import SearchResults from "@/components/search-results";
import { yearsSorts } from "@/lib/urls";
import BookSearchResult from "@/components/book-search-result";
import AuthorsFilter from "@/components/authors-filter";
import dynamic from "next/dynamic";
import { gregorianYearToHijriYear } from "@/lib/date";
import YearFilterSkeleton from "@/components/year-filter/skeleton";
import GenresFilter from "@/components/genres-filter";
import TruncatedText from "@/components/ui/truncated-text";
import { ExpandibleList } from "@/components/ui/expandible-list";
import { getTranslations } from "next-intl/server";
import DottedList from "@/components/ui/dotted-list";
import { getPathLocale } from "@/lib/locale/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

export const generateMetadata = async ({
  params: { regionSlug },
}: {
  params: { regionSlug: string };
}) => {
  const pathLocale = await getPathLocale();
  const region = await findRegionBySlug(regionSlug, pathLocale);
  if (!region) return;

  const name = getPrimaryLocalizedText(region.nameTranslations, pathLocale);

  return {
    title: name,
  };
};

type RegionPageProps = InferPagePropsType<RouteType>;

async function RegionPage({
  routeParams: { regionSlug },
  searchParams,
}: RegionPageProps) {
  const pathLocale = await getPathLocale();
  const region = await findRegionBySlug(regionSlug, pathLocale);

  if (!region) {
    notFound();
  }

  const t = await getTranslations();

  const { q, sort, page, year, authors, genres, view } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      regions: [region.slug],
      yearRange: year,
      genres,
      authors,
    },
  });

  const primaryName = getPrimaryLocalizedText(
    region.nameTranslations,
    pathLocale,
  );
  const secondaryName = getSecondaryLocalizedText(
    region.nameTranslations,
    pathLocale,
  );

  console.log(region.nameTranslations);

  const overview = getPrimaryLocalizedText(
    region.overviewTranslations,
    pathLocale,
  );

  const cities = [
    ...new Set(
      region.locations
        .map((l) => getPrimaryLocalizedText(l.cityNameTranslations, pathLocale))
        .filter(Boolean),
    ),
  ];

  return (
    <div>
      <h1 className="text-5xl font-bold sm:text-7xl">{primaryName}</h1>
      {secondaryName && (
        <h2 className="mt-5 text-3xl font-medium sm:text-5xl">
          {secondaryName}
        </h2>
      )}

      <DottedList
        className="mt-9 sm:mt-14"
        items={[
          <p>{t("entities.x-texts", { count: results.results.found })}</p>,
          <div className="flex items-center">
            <p className="capitalize">{t("common.includes")} &nbsp;</p>

            <ExpandibleList
              items={cities as string[]}
              noun={{
                singular: t("entities.location"),
                plural: t("entities.locations"),
              }}
            />
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
            entity: primaryName,
          })}
          sorts={yearsSorts as any}
          currentSort={sort.raw}
          currentQuery={q}
          view={view}
          filters={
            <>
              <YearFilter
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

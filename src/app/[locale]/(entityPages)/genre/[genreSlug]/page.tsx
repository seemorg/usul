import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import YearFilterClient from "@/components/year-filter/client";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { navigation, yearsSorts } from "@/lib/urls";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { findGenreBySlug } from "@/server/services/genres";
import { searchBooks } from "@/server/typesense/book";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ genreSlug: string; locale: Locale }>;
}) => {
  const { genreSlug, locale } = await params;

  const genre = await findGenreBySlug(genreSlug);
  if (!genre) return;

  const pathLocale = await getPathLocale();
  const primaryText = getPrimaryLocalizedText(
    genre.nameTranslations,
    pathLocale,
  );

  return getMetadata({
    image: {
      url: `/api/og/genre/${genreSlug}`,
      width: 1200,
      height: 720,
    },
    locale,
    pagePath: navigation.genres.bySlug(genreSlug),
    title: primaryText ?? "",
  });
};

type GenrePageProps = InferPagePropsType<RouteType>;

async function GenrePage({ routeParams, searchParams }: GenrePageProps) {
  const { genreSlug } = await routeParams;
  const locale = await getPathLocale();
  const genre = await findGenreBySlug(decodeURIComponent(genreSlug));

  if (!genre) {
    notFound();
  }

  const t = await getTranslations("entities");

  const { q, sort, page, authors, regions, year, view } = await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      genres: [genre.id],
      regions,
      authors,
      yearRange: year,
    },
  });

  const primaryName = getPrimaryLocalizedText(genre.nameTranslations, locale);
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
        <p>{t("x-texts", { count: genre.numberOfBooks })}</p>
      </div>

      {/* {author.bio && (
        <div className="mt-6 text-lg">
          <p>{author.bio}</p>
        </div>
      )} */}

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => (
            <BookSearchResult result={result} view={view} />
          )}
          emptyMessage={t("no-entity", { entity: t("texts") })}
          placeholder={t("search-within", {
            entity: primaryName ?? "",
          })}
          sorts={yearsSorts as any}
          currentSort={sort.raw}
          view={view}
          currentQuery={q}
          filters={
            <>
              <YearFilterClient
                maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
                defaultRange={year}
              />

              <RegionsFilter
                currentRegions={regions}
                filters={{
                  genreId: genre.id,
                }}
              />

              <AuthorsFilter
                currentAuthors={authors}
                selectedAuthorsResponse={results.selectedAuthors}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(GenrePage, Route);

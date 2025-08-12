import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import AuthorsFilter from "@/components/authors-filter";
import BookSearchResult from "@/components/book-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import YearFilterClient from "@/components/year-filter/client";
import { getGenre } from "@/lib/api/genres";
import { searchBooks } from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { navigation, yearsSorts } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { EntityActions } from "../../entity-actions";
import { Route } from "./routeType";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ genreSlug: string; locale: Locale }>;
}) => {
  const { genreSlug, locale } = await params;

  const pathLocale = await getPathLocale();
  const genre = await getGenre(genreSlug, { locale: pathLocale });
  if (!genre) return;

  return getMetadata({
    image: {
      url: `/api/og/genre/${genreSlug}`,
      width: 1200,
      height: 720,
    },
    locale,
    pagePath: navigation.genres.bySlug(genreSlug),
    title: genre.name,
  });
};

type GenrePageProps = InferPagePropsType<RouteType>;

async function GenrePage({ routeParams, searchParams }: GenrePageProps) {
  const { genreSlug } = await routeParams;
  const locale = await getPathLocale();
  const genre = await getGenre(genreSlug, { locale });

  if (!genre) {
    notFound();
  }

  const t = await getTranslations("entities");

  const { q, sort, page, authors, regions, year, view } = await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    locale,
    filters: {
      genres: [genre.id],
      regions,
      authors,
      yearRange: year,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-7xl">
        {genre.name}
      </h1>
      {genre.secondaryName && (
        <h2 className="mt-5 text-xl font-medium sm:text-2xl md:text-3xl lg:text-5xl">
          {genre.secondaryName}
        </h2>
      )}

      <div className="mt-9 flex w-full items-center sm:mt-14">
        <p>{t("x-texts", { count: genre.numberOfBooks })}</p>
      </div>

      <EntityActions
        type="genre"
        entity={{
          type: "genre",
          primaryName: genre.name,
          booksCount: genre.numberOfBooks,
          ...genre,
        }}
      />

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => (
            <BookSearchResult result={result} view={view} />
          )}
          emptyMessage={t("no-entity", { entity: t("texts") })}
          placeholder={t("search-within", {
            entity: t("genre"),
          })}
          sorts={yearsSorts}
          currentSort={sort}
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

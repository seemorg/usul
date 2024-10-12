import BookSearchResult from "@/components/book-search-result";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts, navigation } from "@/lib/urls";
import { findGenreBySlug } from "@/server/services/genres";
import AuthorsFilter from "@/components/authors-filter";
import dynamic from "next/dynamic";
import YearFilterSkeleton from "@/components/year-filter/skeleton";
import { gregorianYearToHijriYear } from "@/lib/date";
import RegionsFilter from "@/components/regions-filter";
import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import { getPathLocale } from "@/lib/locale/server";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

export const generateMetadata = async ({
  params: { genreSlug },
}: {
  params: { genreSlug: string };
}) => {
  const genre = await findGenreBySlug(genreSlug);
  if (!genre) return;

  const locale = await getPathLocale();
  const primaryText = getPrimaryLocalizedText(genre.nameTranslations, locale);

  return getMetadata({
    hasImage: true,
    pagePath: navigation.genres.bySlug(genreSlug),
    title: primaryText ?? "",
  });
};

type GenrePageProps = InferPagePropsType<RouteType>;

async function GenrePage({
  routeParams: { genreSlug },
  searchParams,
}: GenrePageProps) {
  const locale = await getPathLocale();
  const genre = await findGenreBySlug(decodeURIComponent(genreSlug));

  if (!genre) {
    notFound();
  }

  const t = await getTranslations("entities");

  const { q, sort, page, authors, regions, year, view } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
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
            entity: primaryName,
          })}
          sorts={booksSorts as any}
          currentSort={sort}
          view={view}
          currentQuery={q}
          filters={
            <>
              <YearFilter
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

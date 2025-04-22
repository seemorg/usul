import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { yearsSorts, navigation } from "@/lib/urls";
import RegionsFilter from "@/components/regions-filter";
import AuthorsFilter from "@/components/authors-filter";
import { gregorianYearToHijriYear } from "@/lib/date";
import { countAllBooks } from "@/server/services/books";
import RootEntityPage from "../root-entity-page";
import { getTranslations } from "next-intl/server";
import YearFilterSkeleton from "@/components/year-filter/skeleton";
import dynamic from "next/dynamic";
import { getMetadata } from "@/lib/seo";
import type { AppLocale } from "~/i18n.config";

const YearFilter = dynamic(() => import("@/components/year-filter"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

type TextsPageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) {
  return getMetadata({
    title: (await getTranslations("entities"))("texts"),
    pagePath: navigation.books.all(),
    locale,
  });
}

async function TextsPage({ searchParams }: TextsPageProps) {
  const { q, sort, page, genres, authors, regions, year, view } = searchParams;
  const t = await getTranslations("entities");

  const [results, totalBooks] = await Promise.all([
    searchBooks(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
      filters: {
        genres,
        authors,
        regions,
        yearRange: year,
      },
    }),
    countAllBooks(),
  ]);

  return (
    <RootEntityPage
      title={t("texts")}
      description={t("search-x", {
        count: totalBooks,
        entity: t("texts"),
      })}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => (
          <BookSearchResult result={result} view={view} />
        )}
        emptyMessage={t("no-entity", { entity: t("texts") })}
        placeholder={t("search-within", {
          entity: t("texts"),
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

            <RegionsFilter
              currentRegions={regions}
              filters={{
                yearRange: year,
              }}
            />

            <AuthorsFilter
              currentAuthors={authors}
              selectedAuthorsResponse={results.selectedAuthors}
              filters={{
                yearRange: year,
                regions,
              }}
            />

            <GenresFilter
              currentGenres={genres}
              filters={{
                yearRange: year,
              }}
            />
          </>
        }
      />
    </RootEntityPage>
  );
}

export default withParamValidation(TextsPage, Route);

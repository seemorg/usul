import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import AuthorSearchResult from "@/components/author-search-result";
import RegionsFilter from "@/components/regions-filter";
import SearchResults from "@/components/search-results";
import YearFilterClient from "@/components/year-filter/client";
import { searchAuthors } from "@/lib/api/search";
import { gregorianYearToHijriYear } from "@/lib/date";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { countAllAuthors } from "@/server/services/authors";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import RootEntityPage from "../root-entity-page";
import { Route, sorts } from "./routeType";

type PageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("entities"))("authors"),
    pagePath: navigation.authors.all(),
    locale,
  });
}

async function AuthorsPage({ searchParams }: PageProps) {
  const { q, sort, page, year, regions } = await searchParams;
  const t = await getTranslations("entities");

  const pathLocale = await getPathLocale();
  const [results, totalAuthors] = await Promise.all([
    searchAuthors(q, {
      limit: 20,
      page,
      sortBy: sort,
      locale: pathLocale,
      filters: {
        yearRange: year,
        regions,
      },
    }),
    countAllAuthors(),
  ]);

  return (
    <RootEntityPage
      title={t("authors")}
      description={t("search-x", {
        count: totalAuthors,
        entity: t("authors"),
      })}
    >
      <SearchResults
        response={results.results}
        pagination={results.pagination}
        renderResult={(result) => <AuthorSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("authors") })}
        placeholder={t("search-within", {
          entity: t("authors"),
        })}
        sorts={sorts}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentSort={sort}
        currentQuery={q}
        hasViews={false}
        filters={
          <>
            <YearFilterClient
              defaultRange={year}
              maxYear={gregorianYearToHijriYear(new Date().getFullYear())}
            />

            <RegionsFilter currentRegions={regions} countType="authors" />
          </>
        }
      />
    </RootEntityPage>
  );
}

export default withParamValidation(AuthorsPage, Route);

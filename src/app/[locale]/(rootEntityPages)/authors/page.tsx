import SearchResults from "@/components/search-results";
import { Route, sorts  } from "./routeType";
import type {RouteType} from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { gregorianYearToHijriYear } from "@/lib/date";
import AuthorSearchResult from "@/components/author-search-result";
import RegionsFilter from "@/components/regions-filter";
import { countAllAuthors } from "@/server/services/authors";
import RootEntityPage from "../root-entity-page";
import { getTranslations } from "next-intl/server";
import { searchAuthors } from "@/server/typesense/author";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import type { Locale } from "next-intl";
import YearFilterClient from "@/components/year-filter/client";

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

  const [results, totalAuthors] = await Promise.all([
    searchAuthors(q, {
      limit: 20,
      page,
      sortBy: sort.typesenseValue,
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
        sorts={sorts as any}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentSort={sort.raw}
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

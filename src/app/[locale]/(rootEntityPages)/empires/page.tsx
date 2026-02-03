import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import type { SearchResponse } from "@/lib/api/search";
import type { EmpireDocument } from "@/types/empire";
import EmpireSearchResult from "@/components/empire-search-result";
import SearchResults from "@/components/search-results";
import { getTotalEntities } from "@/lib/api";
import { searchEmpires } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { alphabeticalSorts, navigation } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import RootEntityPage from "../root-entity-page";
import { Route, sorts } from "./routeType";

type PageProps = InferPagePropsType<RouteType>;

function emptyEmpiresResponse(page: number): SearchResponse<EmpireDocument> {
  return {
    pagination: {
      totalRecords: 0,
      totalPages: 0,
      currentPage: page,
      hasPrev: false,
      hasNext: false,
    },
    results: { found: 0, page, hits: [] },
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("entities"))("empires"),
    pagePath: navigation.empires.all(),
    locale,
  });
}

async function EmpiresPage({ searchParams }: PageProps) {
  const { q, page, sort } = await searchParams;
  const pathLocale = await getPathLocale();
  const t = await getTranslations("entities");

  const [rawResults, total] = await Promise.all([
    searchEmpires(q, {
      limit: 20,
      page,
      sortBy: sort === "chronological" ? undefined : sort,
      locale: pathLocale,
    }),
    getTotalEntities(),
  ]);

  const results = rawResults ?? emptyEmpiresResponse(page);

  // Sort chronologically by Hijri date if requested
  let sortedResults = results;
  if (sort === "chronological" && results.results.hits.length > 0) {
    const sortedHits = [...results.results.hits].sort((a, b) => {
      // Get the sort year for each empire (prefer start year, fallback to end year)
      const getSortYear = (empire: (typeof results.results.hits)[0]) => {
        // Prefer hijriStartYear if it exists and is greater than 0
        if (empire.hijriStartYear && empire.hijriStartYear > 0) {
          return empire.hijriStartYear;
        }
        // Fallback to hijriEndYear if it exists and is greater than 0
        if (empire.hijriEndYear && empire.hijriEndYear > 0) {
          return empire.hijriEndYear;
        }
        // Put empires with no dates at the end
        return Infinity;
      };

      const yearA = getSortYear(a);
      const yearB = getSortYear(b);

      // If both have the same year (or both are Infinity), maintain original order
      if (yearA === yearB) {
        return 0;
      }

      return yearA - yearB;
    });

    sortedResults = {
      ...results,
      results: {
        ...results.results,
        hits: sortedHits,
      },
    };
  }

  return (
    <RootEntityPage
      title={t("empires")}
      description={t("search-x", {
        count: total.empires,
        entity: t("empires"),
      })}
    >
      {/* <p className="-mt-14 mb-12 flex items-center">
        <InfoIcon className="mr-1 size-4 rtl:ml-1" />
        Empires on Usul are based on the&nbsp;
        <a
          href="https://pil.law.harvard.edu/shariasource-portal/"
          target="_blank"
          className="underline"
        >
          SHARIAsource portal
        </a>
      </p> */}

      <SearchResults
        response={sortedResults.results}
        pagination={sortedResults.pagination}
        renderResult={(result) => <EmpireSearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("empires") })}
        placeholder={t("search-within", {
          entity: t("empires"),
        })}
        hasViews={false}
        sorts={pathLocale === "en" ? [...sorts, ...alphabeticalSorts] : sorts}
        currentSort={sort}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={q}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(EmpiresPage, Route);

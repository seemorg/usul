import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
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

  const [results, total] = await Promise.all([
    searchEmpires(q, {
      limit: 20,
      page,
      sortBy: sort,
      locale: pathLocale,
    }),
    getTotalEntities(),
  ]);

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
        response={results.results}
        pagination={results.pagination}
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

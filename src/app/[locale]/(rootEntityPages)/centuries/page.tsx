import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import CenturySearchResult from "@/components/century-search-result";
import SearchResults from "@/components/search-results";
import { findAllCenturies } from "@/lib/api/centuries";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import Fuse from "fuse.js";
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
    title: (await getTranslations("entities"))("centuries"),
    pagePath: navigation.centuries.all(),
    locale,
  });
}

async function CenturiesPage({ searchParams }: PageProps) {
  const { q, sort } = await searchParams;
  const qString = String(q);

  const t = await getTranslations("entities");
  const centuries = await findAllCenturies();

  const matches =
    qString.length > 0
      ? new Fuse(
        centuries.map((c) => ({
          ...c,
          _name: t("ordinal-century", { count: c.centuryNumber }),
        })),
        {
          keys: ["_name"],
          threshold: 0.3,
        },
      )
        .search(qString)
        .map((r) => r.item)
      : centuries;

  const sorted = matches.sort((a, b) => {
    if (sort === "chronological") {
      return a.centuryNumber - b.centuryNumber;
    }

    if (sort === "texts-desc") {
      return b.totalBooks - a.totalBooks;
    }
    if (sort === "texts-asc") {
      return a.totalBooks - b.totalBooks;
    }

    return 0;
  });

  return (
    <RootEntityPage
      title={t("centuries")}
      subtitle={t("search-x", {
        count: centuries.length,
        entity: t("centuries"),
      })}
    >
      <SearchResults
        response={{
          page: 1,
          found: sorted.length,
          hits: sorted.map((r) => ({ id: r.centuryNumber.toString(), ...r })),
        }}
        pagination={{
          totalRecords: centuries.length,
          totalPages: 1,
          currentPage: 1,
          hasPrev: false,
          hasNext: false,
        }}
        renderResult={(result) => <CenturySearchResult result={result} />}
        emptyMessage={t("no-entity", { entity: t("centuries") })}
        sorts={sorts}
        currentSort={sort}
        placeholder={t("search-within", {
          entity: t("centuries"),
        })}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={qString}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(CenturiesPage, Route);

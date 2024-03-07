import { findAllYearRanges } from "@/server/services/years";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, sorts, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import Fuse from "fuse.js";
import SearchResults from "@/components/search-results";
import CenturySearchResult from "@/components/century-search-result";
import RootEntityPage from "../root-entity-page";
import { getNumberWithOrdinal } from "@/lib/number";

type PageProps = InferPagePropsType<RouteType>;

export const metadata = {
  title: "All Centuries",
};

async function CenturiesPage({ searchParams }: PageProps) {
  const { q, sort } = searchParams;
  const qString = String(q);
  const centuries = await findAllYearRanges();

  const matches =
    qString.length > 0
      ? new Fuse(
          centuries.map((c) => ({
            ...c,
            _name: `${getNumberWithOrdinal(c.centuryNumber)} century`,
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
    if (sort.raw === "chronological") {
      return a.centuryNumber - b.centuryNumber;
    }

    if (sort.raw === "texts") {
      return b.totalBooks - a.totalBooks;
    }

    return 0;
  });

  return (
    <RootEntityPage
      title="Centuries"
      description={`Search ${centuries.length} centuries`}
    >
      <SearchResults
        response={
          {
            page: 1,
            hits: sorted.map((r) => ({
              document: { id: r.centuryNumber, ...r },
            })),
          } as any
        }
        pagination={{
          totalRecords: centuries.length,
          totalPages: 1,
          currentPage: 1,
          hasPrev: false,
          hasNext: false,
        }}
        renderResult={(result) => (
          <CenturySearchResult result={result.document as any} />
        )}
        emptyMessage="No centuries found"
        sorts={sorts as any}
        currentSort={sort.raw}
        placeholder={`Search within Centuries...`}
        itemsContainerClassName="flex flex-col gap-0 sm:gap-0 md:gap-0"
        currentQuery={qString}
      />
    </RootEntityPage>
  );
}

export default withParamValidation(CenturiesPage, Route);

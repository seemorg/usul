import type { ComponentProps } from "react";
import { findAllRegionsWithBooksCount } from "@/lib/api/regions";
import { searchRegions } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";

import RegionsFilterClient from "./client";

type Props = Omit<ComponentProps<typeof RegionsFilterClient>, "regions"> & {
  filters?: Parameters<typeof findAllRegionsWithBooksCount>[0];
  countType?: "books" | "authors";
};

export default async function RegionsFilter(props: Props) {
  const pathLocale = await getPathLocale();
  const regions = await findAllRegionsWithBooksCount(props.filters, pathLocale);
  // const initialRegions = await searchRegions("", {
  //   page: 1,
  //   limit: 10,
  //   sortBy: "texts-desc",
  //   filters: props.filters,
  //   locale: pathLocale,
  // });

  // filter regions with count > 0
  let filteredRegions = regions.filter((region) => region.numberOfBooks > 0);

  // sort regions by count descending
  filteredRegions.sort((a, b) => b.numberOfBooks - a.numberOfBooks);

  return <RegionsFilterClient {...props} regions={filteredRegions} />;
}

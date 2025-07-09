import type { ComponentProps } from "react";
import { getPathLocale } from "@/lib/locale/server";
import { findAllRegionsWithBooksCount } from "@/server/services/regions";

import RegionsFilterClient from "./client";

type Props = Omit<ComponentProps<typeof RegionsFilterClient>, "regions"> & {
  filters?: Parameters<typeof findAllRegionsWithBooksCount>[0];
  countType?: "books" | "authors";
};

export default async function RegionsFilter(props: Props) {
  const regions = await findAllRegionsWithBooksCount(
    props.filters,
    await getPathLocale(),
  );

  return <RegionsFilterClient {...props} regions={regions} />;
}

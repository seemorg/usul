import type { ComponentProps } from "react";
import _RegionsFilter from "./client";
import { findAllRegionsWithBooksCount } from "@/server/services/regions";
import { getPathLocale } from "@/lib/locale/server";

type Props = Omit<ComponentProps<typeof _RegionsFilter>, "regions"> & {
  filters?: Parameters<typeof findAllRegionsWithBooksCount>[0];
  countType?: "books" | "authors";
};

export default async function RegionsFilter(props: Props) {
  const regions = await findAllRegionsWithBooksCount(
    { ...props.filters, countType: props.countType },
    await getPathLocale(),
  );

  return <_RegionsFilter {...props} regions={regions} />;
}

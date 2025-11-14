import type { ComponentProps } from "react";
import { getAdvancedGenreHierarchy } from "@/lib/api/advanced-genres";
import { getPathLocale } from "@/lib/locale/server";

import GenresFilterClient from "./client";

type Props = Omit<ComponentProps<typeof GenresFilterClient>, "hierarchy"> & {
  filters?: Parameters<typeof getAdvancedGenreHierarchy>[0];
};

export default async function GenresFilter(props: Props) {
  const pathLocale = await getPathLocale();
  const hierarchy = await getAdvancedGenreHierarchy({
    ...props.filters,
    locale: pathLocale,
  });
  return <GenresFilterClient {...props} hierarchy={hierarchy as any} />;
}

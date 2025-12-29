import type { ComponentProps } from "react";
import { findAllEmpiresWithBooksCount } from "@/lib/api/empires";
import { getPathLocale } from "@/lib/locale/server";

import EmpiresFilterClient from "./client";

type Props = Omit<ComponentProps<typeof EmpiresFilterClient>, "empires"> & {
  filters?: Parameters<typeof findAllEmpiresWithBooksCount>[0];
  countType?: "books" | "authors";
};

export default async function EmpiresFilter(props: Props) {
  const pathLocale = await getPathLocale();
  const empires = await findAllEmpiresWithBooksCount(props.filters, pathLocale);
  // const initialEmpires = await searchEmpires("", {
  //   page: 1,
  //   limit: 10,
  //   sortBy: "texts-desc",
  //   filters: props.filters,
  //   locale: pathLocale,
  // });

  // filter empires with count > 0
  let filteredEmpires = empires.filter((empire) => empire.numberOfBooks > 0);

  // sort empires by count descending
  filteredEmpires.sort((a, b) => b.numberOfBooks - a.numberOfBooks);

  return <EmpiresFilterClient {...props} empires={filteredEmpires} />;
}

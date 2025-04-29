import type { ComponentProps } from "react";
import { findAllGenresWithBooksCount } from "@/server/services/genres";

import GenresFilterClient from "./client";

type Props = Omit<ComponentProps<typeof GenresFilterClient>, "genres"> & {
  filters?: Parameters<typeof findAllGenresWithBooksCount>[0];
};

export default async function GenresFilter(props: Props) {
  const genres = (await findAllGenresWithBooksCount(props.filters)).filter(
    (g) => !!g.id,
  );

  return <GenresFilterClient {...props} genres={genres as any} />;
}

import type { ComponentProps } from "react";
import _GenresFilter from "./client";
import { findAllGenresWithBooksCount } from "@/server/services/genres";

type Props = Omit<ComponentProps<typeof _GenresFilter>, "genres"> & {
  filters?: Parameters<typeof findAllGenresWithBooksCount>[0];
};

export default async function GenresFilter(props: Props) {
  const genres = (await findAllGenresWithBooksCount(props.filters)).filter(
    (g) => !!g.genreId,
  );

  return <_GenresFilter {...props} genres={genres as any} />;
}

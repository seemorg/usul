import type { ComponentProps } from "react";
import { searchAuthors } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";

import AuthorsFilterClient from "./client";

type Props = Omit<
  ComponentProps<typeof AuthorsFilterClient>,
  "initialAuthorsResponse" | "booksCount"
>;

export default async function AuthorsFilter(props: Props) {
  const pathLocale = await getPathLocale();
  const initialAuthors = await searchAuthors("", {
    page: 1,
    limit: 10,
    sortBy: "texts-desc",
    filters: props.filters,
    locale: pathLocale,
  });

  return (
    <AuthorsFilterClient {...props} initialAuthorsResponse={initialAuthors} />
  );
}

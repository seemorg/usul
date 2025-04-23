import type { ComponentProps } from "react";
import AuthorsFilterClient from "./client";
import { findAllAuthorIdsWithBooksCount } from "@/server/services/authors";
import { searchAuthors } from "@/server/typesense/author";

type Props = Omit<
  ComponentProps<typeof AuthorsFilterClient>,
  "initialAuthorsResponse" | "booksCount"
>;

export default async function AuthorsFilter(props: Props) {
  const [initialAuthors, booksCount] = await Promise.all([
    searchAuthors("", {
      page: 1,
      limit: 10,
      sortBy: "booksCount:desc,_text_match:desc",
      filters: props.filters,
    }),
    findAllAuthorIdsWithBooksCount(),
  ]);

  return (
    <AuthorsFilterClient
      {...props}
      initialAuthorsResponse={initialAuthors}
      booksCount={booksCount}
    />
  );
}

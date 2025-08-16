import {
  searchAllCollections,
  searchAuthors,
  searchBooks,
  searchGenres,
} from "@/lib/api/search";
import { usePathLocale } from "@/lib/locale/utils";
import { SearchType } from "@/types/search";
import { useQuery } from "@tanstack/react-query";

const typeToMethod = {
  all: searchAllCollections,
  texts: searchBooks,
  authors: searchAuthors,
  genres: searchGenres,
} satisfies Record<SearchType, any>;

type SearchResults = Awaited<ReturnType<typeof searchAllCollections>>;

export function useSearch({
  searchType,
  value,
}: {
  searchType: SearchType;
  value: string;
}) {
  const pathLocale = usePathLocale();
  return useQuery<SearchResults>({
    queryKey: ["search", searchType, value],
    queryFn: ({ queryKey }) => {
      const [, type, query = ""] = queryKey as [string, SearchType, string];
      const method = typeToMethod[type];
      return method(query, {
        limit: 5,
        locale: pathLocale,
      }) as Promise<SearchResults>;
    },
    enabled: !!value,
  });
}

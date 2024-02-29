import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/lib/search";
import { findAuthorBySlug } from "@/server/services/authors";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts } from "@/lib/urls";
import { OtherNames } from "@/app/_components/other-names";

type AuthorPageProps = InferPagePropsType<RouteType>;

async function AuthorPage({
  routeParams: { authorSlug },
  searchParams,
}: AuthorPageProps) {
  const author = await findAuthorBySlug(authorSlug);

  if (!author) {
    notFound();
  }

  const { q, sort, page, genres } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    filters: {
      genres,
      authors: [author.id], // books for the current author only
    },
  });

  const primaryName = author.primaryLatinName ?? author.primaryArabicName;
  const secondaryName =
    primaryName === author.primaryLatinName ? author.primaryArabicName : null;

  return (
    <div>
      <h1 className="text-7xl font-bold">{primaryName}</h1>
      {secondaryName && (
        <h2 className="mt-5 text-5xl font-medium">{secondaryName}</h2>
      )}

      <div className="mt-16 flex w-full items-center gap-10">
        <p>{author.year} AH</p>

        <div className="flex items-center gap-2">
          <p>Also known as</p>

          <OtherNames
            names={author.otherArabicNames.concat(author.otherLatinNames)}
          />
        </div>
      </div>

      <div className="mt-10 text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, eligendi
        iure accusamus sapiente laborum fugiat alias omnis quas excepturi vero
        laboriosam et sunt officia nulla repellat dolores illo aliquam ad
        mollitia incidunt corrupti veritatis tenetur esse? Perspiciatis, odit
        corrupti soluta laborum molestias adipisci. Explicabo commodi
        dignissimos maxime, obcaecati quisquam necessitatibus, animi,
        voluptatibus reiciendis eos molestias hic eaque voluptatum atque dolorem
        quasi tenetur deleniti. Aliquid minus, blanditiis architecto autem sit
        vitae tempore incidunt, quaerat optio distinctio qui, earum eaque
        inventore reiciendis minima adipisci.
      </div>

      <div className="mt-10">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => <BookSearchResult result={result} />}
          emptyMessage="No books found"
          sorts={booksSorts as any}
          currentSort={sort}
          currentQuery={q}
          filters={
            <GenresFilter allGenres={author.genreTags} currentGenres={genres} />
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(AuthorPage, Route);

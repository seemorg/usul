/* eslint-disable react/jsx-key */
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/lib/search";
import { findAuthorBySlug } from "@/server/services/authors";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts, navigation } from "@/lib/urls";
import { ExpandibleList } from "@/components/ui/expandible-list";
import TruncatedText from "@/components/ui/truncated-text";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { toTitleCase } from "@/lib/string";
import DottedList from "@/components/ui/dotted-list";

type AuthorPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { authorSlug },
}: {
  params: { authorSlug: string };
}) => {
  const author = await findAuthorBySlug(authorSlug);
  if (!author) return;

  return {
    title: author.primaryLatinName ?? author.primaryArabicName ?? undefined,
  };
};

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

  const locations = author.locations
    .filter((l) => !!l.location.region)
    .sort((a, b) => {
      // sort should be:
      // 1. born
      // 2. resided
      // 3. visited
      // 4. died

      const aType = a.location.type;
      const bType = b.location.type;

      if (aType === "born") return -1;
      if (bType === "born") return 1;

      if (aType === "died") return 1;
      if (bType === "died") return -1;

      if (aType === "resided") return -1;
      if (bType === "resided") return 1;

      if (aType === "visited") return -1;
      if (bType === "visited") return 1;

      return 0;
    });

  return (
    <div>
      <h1 className="text-5xl font-bold sm:text-7xl">{primaryName}</h1>
      {secondaryName && (
        <h2 className="mt-5 text-3xl font-medium sm:text-5xl">
          {secondaryName}
        </h2>
      )}

      <DottedList
        className="mt-9 sm:mt-14"
        items={[
          <Button variant="link" asChild className="h-auto p-0">
            <Link href={navigation.centuries.byYear(author.year)}>
              {author.year} AH
            </Link>
          </Button>,
          locations.length > 0 && (
            <>
              <p className="capitalize">Lived: &nbsp;</p>

              <ExpandibleList
                triggerItems={
                  locations.map((l) => l.location.region?.name) as string[]
                }
                items={
                  locations.map(
                    (l) =>
                      `${l.location.region?.name} (${toTitleCase(l.location.type)})`,
                  ) as string[]
                }
                noun={{
                  singular: "location",
                  plural: "locations",
                }}
              />
            </>
          ),
          <p>{author.numberOfBooks} Texts</p>,
          <>
            <p>Also known as &nbsp;</p>

            <ExpandibleList
              items={author.otherLatinNames.concat(author.otherArabicNames)}
              noun={{
                singular: "name",
                plural: "names",
              }}
            />
          </>,
        ]}
      />

      {author.bio && (
        <TruncatedText className="mt-7 text-lg">{author.bio}</TruncatedText>
      )}

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => <BookSearchResult result={result} />}
          emptyMessage="No books found"
          sorts={booksSorts as any}
          placeholder={`Search within ${primaryName}...`}
          currentSort={sort}
          currentQuery={q}
          filters={
            <GenresFilter
              currentGenres={genres}
              filters={{
                authorId: author.id,
              }}
            />
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(AuthorPage, Route);

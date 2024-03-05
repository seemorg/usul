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
import { toTitleCase } from "~/scripts/utils";

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
    .filter((l) => !!l.location.regionCode)
    .sort((a, b) => {
      // give higher priority to the location with the type "lived"
      if (a.location.type === "resided") return -1;
      if (b.location.type === "resided") return 1;
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

      <div className="mt-14 flex w-full flex-wrap items-center gap-3">
        <div className="flex items-center">
          <Button variant="link" asChild className="p-0">
            <Link href={navigation.centuries.byYear(author.year)}>
              {author.year} AH
            </Link>
          </Button>

          <span className="ml-3 text-muted-foreground">•</span>
        </div>

        {locations.length > 0 && (
          <div className="flex items-center">
            <div className="flex items-center">
              <p className="capitalize">Lived: &nbsp;</p>

              <ExpandibleList
                triggerItems={
                  locations.map((l) => l.location.regionCode) as string[]
                }
                items={
                  locations.map(
                    (l) =>
                      `${toTitleCase(l.location.type)}: ${l.location.regionCode}`,
                  ) as string[]
                }
                noun={{
                  singular: "location",
                  plural: "locations",
                }}
              />
            </div>

            <span className="ml-3 text-muted-foreground">•</span>
          </div>
        )}

        <div className="flex items-center">
          <p>{author.numberOfBooks} Texts</p>

          <span className="ml-3 text-muted-foreground">•</span>
        </div>

        <div className="flex items-center">
          <p>Also known as &nbsp;</p>

          <ExpandibleList
            items={author.otherLatinNames.concat(author.otherArabicNames)}
            noun={{
              singular: "name",
              plural: "names",
            }}
          />
        </div>
      </div>

      {author.bio && (
        <TruncatedText className="mt-6 text-lg">{author.bio}</TruncatedText>
      )}

      <div className="mt-16">
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

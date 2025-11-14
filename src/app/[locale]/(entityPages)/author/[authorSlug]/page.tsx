import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import DottedList from "@/components/ui/dotted-list";
import { ExpandibleList } from "@/components/ui/expandible-list";
import TruncatedText from "@/components/ui/truncated-text";
import { getAuthorBySlug } from "@/lib/api/authors";
import { searchBooks } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { alphabeticalSorts, booksSorts, navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { LocationType } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { EntityActions } from "../../entity-actions";
import { Route } from "./routeType";

type AuthorPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ authorSlug: string; locale: Locale }>;
}) => {
  const { authorSlug, locale } = await params;
  const pathLocale = appLocaleToPathLocale(locale);

  const author = await getAuthorBySlug(authorSlug, { locale: pathLocale });
  if (!author || !author.primaryName) return;

  const authorSecondary = author.secondaryName;
  const bio = author.bio;

  const t = await getTranslations("meta");

  const description = `${t(
    authorSecondary
      ? "author-page.description-secondary"
      : "author-page.description",
    {
      author: author.primaryName,
      books: author.numberOfBooks,
      ...(authorSecondary ? { authorSecondary } : {}),
    },
  )}${bio ? ` ${bio}` : ""}`;

  const truncatedDescription =
    description.length > 157 ? `${description.slice(0, 157)}...` : description;

  return getMetadata({
    concatTitle: false,
    image: {
      url: `/api/og/author/${authorSlug}`,
      width: 1200,
      height: 720,
    },
    locale,
    pagePath: navigation.authors.bySlug(authorSlug),
    title: t("author-page.title", {
      author: author.primaryName,
    }),
    description: truncatedDescription,
    keywords: [author.primaryName, ...(author.otherNames ?? [])],
  });
};

async function AuthorPage({ routeParams, searchParams }: AuthorPageProps) {
  const { authorSlug } = await routeParams;
  const pathLocale = await getPathLocale();

  const author = await getAuthorBySlug(authorSlug, { locale: pathLocale });
  const t = await getTranslations();

  if (!author) {
    notFound();
  }

  const { q, sort, page, genres, view } = await searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    locale: pathLocale,
    filters: {
      genres,
      authors: [author.id], // books for the current author only
    },
  });

  const primaryName = author.primaryName;
  const secondaryName = author.secondaryName;

  const locations = author.locations
    .filter((l) => !!l.regionId)
    .sort((a, b) => {
      // sort should be:
      // 1. born
      // 2. resided
      // 3. visited
      // 4. died

      const aType = a.type;
      const bType = b.type;

      if (aType === LocationType.Born) return -1;
      if (bType === LocationType.Born) return 1;

      if (aType === LocationType.Died) return 1;
      if (bType === LocationType.Died) return -1;

      if (aType === LocationType.Resided) return -1;
      if (bType === LocationType.Resided) return 1;

      if (aType === LocationType.Visited) return -1;
      if (bType === LocationType.Visited) return 1;

      return 0;
    });

  const localizedLocationItems = locations.map((l) => {
    const region = l.region;
    const name = region.name;

    const key = `common.${l.type.toLowerCase()}` as any;
    const localizedType = t(key);

    return {
      region: name,
      text: `${name} (${localizedType === key ? l.type : localizedType})`,
    };
  });

  // filter out duplicates
  const uniqueLocations = localizedLocationItems.filter(
    (l, index, self) => index === self.findIndex((t) => t.text === l.text),
  );

  const bio = author.bio;
  const otherNames = author.otherNames ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-7xl">
        {primaryName}
      </h1>
      {secondaryName && (
        <h2 className="mt-5 text-xl font-medium sm:text-2xl md:text-3xl lg:text-5xl">
          {secondaryName}
        </h2>
      )}

      <EntityActions
        type="author"
        entity={{
          type: "author",
          booksCount: author.numberOfBooks,
          regions: [],
          geographies: [],
          ...author,
        }}
      />

      <DottedList
        className="mt-9 sm:mt-14"
        items={[
          author.year ? (
            <Button variant="link" asChild className="h-auto p-0">
              <Link href={navigation.centuries.byYear(author.year)} prefetch>
                {t("common.year-format.ah.value", { year: author.year })}
              </Link>
            </Button>
          ) : null,
          locations.length > 0 && (
            <>
              <p className="capitalize">{t("common.lived")}: &nbsp;</p>

              <ExpandibleList
                triggerItems={uniqueLocations.map((l) => l.region)}
                items={uniqueLocations.map((l) => l.text)}
                noun={{
                  singular: t("entities.location"),
                  plural: t("entities.locations"),
                }}
              />
            </>
          ),
          <p>{t("entities.x-texts", { count: author.numberOfBooks })}</p>,
          <>
            <p>{t("common.aka")} &nbsp;</p>

            <ExpandibleList
              items={otherNames}
              noun={{
                singular: t("entities.name"),
                plural: t("entities.names"),
              }}
            />
          </>,
        ]}
      />

      {bio && <TruncatedText className="mt-7 text-lg">{bio}</TruncatedText>}

      <div className="mt-10 sm:mt-16">
        <SearchResults
          response={results.results}
          pagination={results.pagination}
          renderResult={(result) => (
            <BookSearchResult result={result} view={view} />
          )}
          emptyMessage={t("entities.no-entity", {
            entity: t("entities.texts"),
          })}
          placeholder={t("entities.search-within", {
            entity: t("entities.author"),
          })}
          sorts={
            pathLocale === "en"
              ? [...booksSorts, ...alphabeticalSorts]
              : booksSorts
          }
          currentSort={sort}
          currentQuery={q}
          view={view}
          filters={
            <GenresFilter
              currentGenres={genres}
              // TODO: fix author filter
              // filters={{
              //   authorId: author.id,
              // }}
            />
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(AuthorPage, Route);

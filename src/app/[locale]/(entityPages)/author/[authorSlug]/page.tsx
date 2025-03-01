/* eslint-disable react/jsx-key */
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
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
import DottedList from "@/components/ui/dotted-list";
import { getLocale, getPathLocale } from "@/lib/locale/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { LocationType } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { appLocaleToPathLocale } from "@/lib/locale/utils";

type AuthorPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { authorSlug },
}: {
  params: { authorSlug: string };
}) => {
  const locale = await getLocale();
  const pathLocale = appLocaleToPathLocale(locale);

  const author = await findAuthorBySlug(authorSlug, pathLocale);
  if (!author) return;

  const name = getPrimaryLocalizedText(
    author.primaryNameTranslations,
    pathLocale,
  );
  if (!name) return;

  const authorSecondary = getSecondaryLocalizedText(
    author.primaryNameTranslations,
    pathLocale,
  );

  const bio = getPrimaryLocalizedText(author.bioTranslations, pathLocale);

  const t = await getTranslations("meta");

  const description = `${t(
    authorSecondary
      ? "author-page.description-secondary"
      : "author-page.description",
    {
      author: name ?? "",
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
      author: name,
    }),
    description: truncatedDescription,
    keywords: author.primaryNameTranslations
      .map((t) => t.text)
      .concat(author.otherNameTranslations.flatMap((t) => t.texts)),
    authors: [{}],
  });
};

async function AuthorPage({
  routeParams: { authorSlug },
  searchParams,
}: AuthorPageProps) {
  const pathLocale = await getPathLocale();

  const author = await findAuthorBySlug(
    decodeURIComponent(authorSlug),
    pathLocale,
  );
  const t = await getTranslations();

  if (!author) {
    notFound();
  }

  const { q, sort, page, genres, view } = searchParams;

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    filters: {
      genres,
      authors: [author.id], // books for the current author only
    },
  });

  const primaryName =
    pathLocale === "en" && author.transliteration
      ? author.transliteration
      : getPrimaryLocalizedText(author.primaryNameTranslations, pathLocale);

  const secondaryName = getSecondaryLocalizedText(
    author.primaryNameTranslations,
    pathLocale,
  );

  const locations = author.locations
    .filter((l) => !!l.region)
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

  const localizedLocations = locations.map((l) => {
    const region = l.region!;
    return getPrimaryLocalizedText(region.nameTranslations, pathLocale);
  }) as string[];

  const localizedLocationItems = locations.map((l) => {
    const region = l.region!;
    const name = getPrimaryLocalizedText(region.nameTranslations, pathLocale);

    const key = `common.${l.type.toLowerCase()}` as any;
    const localizedType = t(key);

    return `${name} (${localizedType === key ? l.type : localizedType})`;
  });

  const bio = getPrimaryLocalizedText(author.bioTranslations, pathLocale);
  const otherNames = (
    getPrimaryLocalizedText(author.otherNameTranslations, pathLocale) ?? []
  ).filter(Boolean) as string[];

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
                triggerItems={localizedLocations}
                items={localizedLocationItems}
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
            entity: primaryName,
          })}
          sorts={booksSorts as any}
          currentSort={sort}
          currentQuery={q}
          view={view}
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

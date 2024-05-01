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
// import { toTitleCase } from "@/lib/string";
import DottedList from "@/components/ui/dotted-list";
import { getLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "~/i18n.config";
import { getMetadata } from "@/lib/seo";

type AuthorPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { authorSlug },
}: {
  params: { authorSlug: string };
}) => {
  const author = await findAuthorBySlug(authorSlug);
  const name = author?.primaryLatinName ?? author?.primaryArabicName;
  if (!author || !name) return;
  const t = await getTranslations("meta");

  return getMetadata({
    concatTitle: false,
    title: t("author-page.title", {
      author: author?.primaryLatinName ?? "",
    }),
    description: `${t("author-page.description", {
      author: author?.primaryLatinName ?? "",
      authorArabic: author?.primaryArabicName ?? "",
      books: author.numberOfBooks,
    })}${author.bio ? ` ${author.bio}` : ""}`,
  });
};

async function AuthorPage({
  routeParams: { authorSlug },
  searchParams,
}: AuthorPageProps) {
  const author = await findAuthorBySlug(decodeURIComponent(authorSlug));
  const t = await getTranslations();
  const locale = (await getLocale()) as AppLocale;

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

  const localizedLocations = locations.map((l) => {
    const region = l.location.region!;
    if (locale === "ar-SA" && region.arabicName) {
      return region.arabicName;
    }

    return region.name;
  }) as string[];

  const localizedLocationItems = locations.map((l) => {
    const region = l.location.region!;
    const name =
      locale === "ar-SA" ? region.arabicName ?? region.name : region.name;

    const key = `common.${l.location.type}` as any;
    const localizedType = t(key);

    return `${name} (${localizedType === key ? l.location.type : localizedType})`;
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
              {t("common.year-format.ah.value", { year: author.year })}
            </Link>
          </Button>,
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
              items={author.otherLatinNames.concat(author.otherArabicNames)}
              noun={{
                singular: t("entities.name"),
                plural: t("entities.names"),
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

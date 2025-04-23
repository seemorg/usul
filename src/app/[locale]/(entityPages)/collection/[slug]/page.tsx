/* eslint-disable react/jsx-key */
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { yearsSorts, navigation } from "@/lib/urls";

import DottedList from "@/components/ui/dotted-list";

import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { collections } from "@/data/collections";
import TruncatedText from "@/components/ui/truncated-text";
import { Locale } from "next-intl";

type CollectionPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) => {
  const { slug, locale } = await params;

  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return;

  const t = await getTranslations("collections");

  return getMetadata({
    locale,
    pagePath: navigation.collections.bySlug(slug),
    title: t(collection.title),
    description: t(collection.description),
  });
};

async function CollectionPage({
  routeParams,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await routeParams;
  const { q, sort, page, genres, view } = await searchParams;
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const t = await getTranslations();

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort.typesenseValue,
    filters: {
      genres,
      ids: collection.bookIds,
    },
  });

  const title = t(`collections.${collection.title}`);
  const description = t(`collections.${collection.description}`);

  return (
    <div>
      <h1 className="text-5xl font-bold sm:text-7xl">{title}</h1>
      {description && (
        <TruncatedText className="mt-7 text-lg">{description}</TruncatedText>
      )}

      <DottedList
        className="mt-9"
        items={[
          <p>{t("entities.x-texts", { count: collection.bookIds.length })}</p>,
        ]}
      />

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
            entity: title,
          })}
          sorts={yearsSorts as any}
          currentSort={sort.raw}
          currentQuery={q}
          view={view}
          filters={
            <GenresFilter
              currentGenres={genres}
              filters={{
                bookIds: collection.bookIds,
              }}
            />
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(CollectionPage, Route);

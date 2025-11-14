import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import { notFound } from "next/navigation";
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import DottedList from "@/components/ui/dotted-list";
import TruncatedText from "@/components/ui/truncated-text";
import { collections } from "@/data/collections";
import { searchBooks } from "@/lib/api/search";
import { getPathLocale } from "@/lib/locale/server";
import { getMetadata } from "@/lib/seo";
import { alphabeticalSorts, navigation, yearsSorts } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";

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
  const pathLocale = await getPathLocale();

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    locale: pathLocale,
    filters: {
      advancedGenres: genres,
      ids: collection.bookIds,
    },
  });

  const title = t(`collections.${collection.title}`);
  const description = t(`collections.${collection.description}`);

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-7xl">{title}</h1>
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
            entity: t("entities.collection"),
          })}
          sorts={
            pathLocale === "en"
              ? [...yearsSorts, ...alphabeticalSorts]
              : yearsSorts
          }
          currentSort={sort}
          currentQuery={q}
          view={view}
          filters={
            <GenresFilter
              currentGenres={genres}
              // TODO: fix collection filter
              // filters={{
              //   bookIds: collection.bookIds,
              // }}
            />
          }
        />
      </div>
    </div>
  );
}

export default withParamValidation(CollectionPage, Route);

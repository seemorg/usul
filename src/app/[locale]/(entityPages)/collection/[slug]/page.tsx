/* eslint-disable react/jsx-key */
import BookSearchResult from "@/components/book-search-result";
import GenresFilter from "@/components/genres-filter";
import SearchResults from "@/components/search-results";
import { searchBooks } from "@/server/typesense/book";
import { notFound } from "next/navigation";
import { withParamValidation } from "next-typesafe-url/app/hoc";
import { Route, type RouteType } from "./routeType";
import type { InferPagePropsType } from "next-typesafe-url";
import { booksSorts, navigation } from "@/lib/urls";

import DottedList from "@/components/ui/dotted-list";
import { getLocale } from "@/lib/locale/server";

import { getTranslations } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { collections } from "@/data/collections";
import TruncatedText from "@/components/ui/truncated-text";

type CollectionPageProps = InferPagePropsType<RouteType>;

export const generateMetadata = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const locale = await getLocale();

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
  routeParams: { slug },
  searchParams,
}: CollectionPageProps) {
  const { q, sort, page, genres, view } = searchParams;
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const t = await getTranslations();

  const results = await searchBooks(q, {
    limit: 20,
    page,
    sortBy: sort,
    filters: {
      genres,
      ids: collection.bookIds,
    },
  });

  // console.dir(
  //   results.results.hits
  //     .filter((h) => {
  //       return !h.document.versions?.some((v) => v.source !== "pdf");
  //     })
  //     .map((h) => ({
  //       title:
  //         h.document.primaryNames.find((n) => n.locale === "ar")?.text ||
  //         h.document.transliteration,
  //       id: h.document.id,
  //     })),
  //   { depth: null },
  // );

  // [
  //   {
  //     title: 'القواعد الاصولية والفقهية على مذهب الامامية',
  //     id: 'lj9eru8v4zhvy358830ssdcu'
  //   },
  //   {
  //     title: 'القواعد الفقهية عند الإباضية: دراسة نظرية تحليلية تأصيلية تطبيقية',
  //     id: 'n8puo532hxymiqunknjsjhui',
  //     ocrBookId: 'cm273vcbh0000g33dex3xed8l'
  //   },
  //   {
  //     title: 'Studies in Ibādism (al-Ibādīyah)',
  //     id: 'u7k4xd1xfq9hfkv60ziuw06i'
  //   },
  //   {
  //     title: 'رسالة ذات البيان في الرد على ابن قتيبة',
  //     id: 'cwxmfhmbcp69f40j1c1w0wqj'
  //   },
  //   {
  //     title: 'القواعد الكبرى في الفقه الإسلامي',
  //     id: 'qkad0wubc9flndxzomkizldq'
  //   },
  //   {
  //     title: 'The Codification of Islamic Juridical Principles (qawāʿid fiqhiyya): A Historical Outline',
  //     id: 'qs7trgbye1sjj1nf04nuw696'
  //   },
  //   {
  //     title: 'المستثنيات من القواعد الفقهية (أنواعها والقياس عليها)',
  //     id: 'igzffeocfm2f31suozec9vbx'
  //   },
  //   {
  //     title: 'Legal maxims and other genres of literature in Islamic jurisprudence',
  //     id: 'cdmterqdow2zv232qdbpxhly'
  //   },
  //   {
  //     title: 'Origins of Muhammadan Jurisprudence',
  //     id: 'zrop56zg6wrub85ylzpibnms'
  //   },
  //   { title: 'شرح مدار الأصول', id: 'xgaoldpjwdfxqx4yougfpr6o' },
  //   {
  //     title: 'القواعد الفقهية: المبادئ، المقومات، المصادر، الدليلية، التطور ',
  //     id: 'ijzv5ghfcjw9ehphqmy5m6ob'
  //   },
  //   {
  //     title: 'المعايير الجلية في التمييز بين الأحكام والقواعد والضوابط الفقهية',
  //     id: 'e1bpvpqllzan9kggty0koc08',
  //     ocrBookId: 'clztduz3m0000p4c697yy8jue'
  //   },
  //   {
  //     title: 'القواعد الفقهية: مفهومها، ونشأتها، وتطورها، ودراسة مؤلفاتها أدلتها، مهمتها، تطبيقاتها',
  //     id: 'j975mv5ng7d6yupj92oalqk2'
  //   }
  // ]

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
          sorts={booksSorts as any}
          currentSort={sort}
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

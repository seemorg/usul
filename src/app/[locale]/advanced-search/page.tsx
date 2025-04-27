import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

import SearchResults from "@/components/search-results";
import Container from "@/components/ui/container";

import { getMetadata } from "@/lib/seo";
import { booksSorts, navigation } from "@/lib/urls";

import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";
import { searchCorpus } from "@/server/services/chat";
import AdvancedSearchResult from "./search-result";

type TextsPageProps = InferPagePropsType<RouteType>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("common"))("advanced-search"),
    pagePath: navigation.search.advanced(),
    locale,
  });
}

async function AdvancedSearchPage({ searchParams }: TextsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { page, q, sort } = resolvedSearchParams;
  const t = await getTranslations();

  const results = q ? await searchCorpus(q, page) : null;

  return (
    <div>
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col pb-24">
        <div className="bg-muted-primary flex h-[250px] w-full items-center justify-center pt-16 text-white sm:h-[300px] sm:pt-24">
          <Container className="flex flex-col items-center">
            <h1 className="text-center text-6xl font-bold sm:text-7xl">
              {t("common.advanced-search")}
            </h1>
          </Container>
        </div>

        <Container className="bg-background mt-10 sm:mt-20">
          <SearchResults
            hasViews={false}
            response={{
              found: results?.total ?? 0,
              page: results?.currentPage ?? 1,
              hits:
                results?.results.map((result) => ({
                  document: { id: result.node.id, ...result },
                })) ?? [],
            }}
            pagination={
              results
                ? {
                    totalPages: results.totalPages,
                    totalRecords: results.total,
                    currentPage: results.currentPage,
                    hasPrev: results.hasPreviousPage,
                    hasNext: results.hasNextPage,
                  }
                : undefined
            }
            renderResult={({ document }) => (
              <AdvancedSearchResult result={document} />
            )}
            emptyMessage={t("entities.no-entity", {
              entity: t("entities.texts"),
            })}
            placeholder={t("entities.search-within", {
              entity: t("entities.texts"),
            })}
            sorts={booksSorts}
            currentSort={sort.raw}
            currentQuery={q}
          />
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default withParamValidation(AdvancedSearchPage, Route);

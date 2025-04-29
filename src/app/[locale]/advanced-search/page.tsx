import type { Locale } from "next-intl";
import type { InferPagePropsType } from "next-typesafe-url";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

import Container from "@/components/ui/container";

import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";

import { getTranslations } from "next-intl/server";
import { withParamValidation } from "next-typesafe-url/app/hoc";

import type { RouteType } from "./routeType";
import { Route } from "./routeType";
import { searchCorpus } from "@/server/services/chat";
import AdvancedSearchResult from "./search-result";
import { Link } from "@/navigation";
import { prepareSearchParams } from "@/lib/params";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Paginator from "@/components/ui/pagination";
import AdvancedSearchInput from "./input";

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
  const { page, q, type } = resolvedSearchParams;
  const t = await getTranslations();

  const results = q ? await searchCorpus(q, type, page) : null;

  return (
    <div>
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col pb-24">
        <div className="bg-muted-primary flex h-[300px] w-full items-center justify-center pt-16 text-white sm:pt-24">
          <Container className="flex flex-col items-center">
            <h1 className="text-center text-6xl font-bold sm:text-7xl">
              {t("common.advanced-search")}
            </h1>

            <div className="mt-8 flex gap-1">
              <Button
                asChild
                variant={type === "semantic" ? "secondary" : "ghost"}
              >
                <Link
                  href={`${navigation.search.advanced()}${prepareSearchParams({
                    type: "semantic",
                    q,
                  })}`}
                >
                  {t("reader.search.semantic")}
                </Link>
              </Button>

              <Button
                asChild
                variant={type === "keyword" ? "secondary" : "ghost"}
              >
                <Link
                  href={`${navigation.search.advanced()}${prepareSearchParams({
                    type: "keyword",
                    q,
                  })}`}
                >
                  {t("reader.search.simple")}
                </Link>
              </Button>
            </div>
          </Container>
        </div>

        <Container className="bg-background mt-10 sm:mt-20">
          <AdvancedSearchInput />

          <div className="my-10 flex flex-col gap-10">
            {results?.results && results.results.length > 0 ? (
              results.results.map((result) => (
                <AdvancedSearchResult key={result.node.id} result={result} />
              ))
            ) : (
              <p>
                {t("entities.no-entity", {
                  entity: t("entities.texts"),
                })}
              </p>
            )}
          </div>

          <Suspense>
            <Paginator
              totalPages={results?.totalPages ?? 0}
              currentPage={results?.currentPage ?? 1}
            />
          </Suspense>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default withParamValidation(AdvancedSearchPage, Route);

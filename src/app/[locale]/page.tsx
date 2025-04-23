/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import Container from "@/components/ui/container";
import Navbar from "../_components/navbar";
import SearchBar from "../_components/navbar/search-bar";
import { Link } from "@/navigation";
import BookSearchResult from "@/components/book-search-result";

import Footer from "../_components/footer";
import { navigation } from "@/lib/urls";
import {
  fetchPopularBooks,
  fetchPopularIslamicHistoryBooks,
  fetchPopularIslamicLawBooks,
} from "@/data/popular-books";
import HomepageSection from "../_components/homepage-section";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { type AppLocale, routing } from "~/i18n.config";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { CollectionCard } from "@/components/ui/collection-card";
import { PlayIcon } from "@heroicons/react/24/solid";

import { cn } from "@/lib/utils";
import { DemoButton } from "./demo-button";
import { getHomepageGenres } from "@/lib/api";
import { collections } from "@/data/collections";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) => {
  const { locale } = await params;
  return getMetadata({ pagePath: "/", locale });
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);

  const pathLocale = appLocaleToPathLocale(locale);

  const [
    genres,
    popularBooks,
    popularIslamicLawBooks,
    popularIslamicHistoryBooks,
  ] = await Promise.all([
    getHomepageGenres({ locale: pathLocale }),
    fetchPopularBooks(pathLocale),
    fetchPopularIslamicLawBooks(pathLocale),
    fetchPopularIslamicHistoryBooks(pathLocale),
  ]);

  const t = await getTranslations({ locale });

  return (
    <>
      <Navbar layout="home" />

      <div className="relative flex min-h-[470px] w-full pb-10 pt-24 text-white sm:pt-28">
        <div className="absolute inset-0 z-0 h-full w-full bg-muted-primary" />
        {/* [clip-path:ellipse(130%_100%_at_50%_0%)] */}

        <Container className="z-[1] flex flex-col items-center">
          <h1 className="text-center text-4xl font-bold sm:text-5xl">
            {t("home.headline")}
          </h1>

          <p className="mt-5 text-center text-xl text-white/80">
            {t("home.subheadline")}
          </p>

          <div className="mt-7 flex w-full justify-center">
            <DemoButton>
              <PlayIcon className="size-4" />
              {t("home.how-usul-works")} - 2:40
            </DemoButton>
          </div>

          <div className={cn("w-full", "mt-16 sm:mt-[4.5rem]")}>
            <div className="mx-auto max-w-[46rem]">
              <SearchBar size="lg" />
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-4 py-10 sm:gap-12 sm:py-12">
        <div>
          <HomepageSection
            isBooks={false}
            title={t("home.sections.collections")}
            items={(genres || [])
              .map((genre) => (
                <Link
                  key={genre.id}
                  href={navigation.genres.bySlug(genre.slug)}
                  prefetch
                >
                  <CollectionCard
                    title={genre.name}
                    numberOfBooks={genre.numberOfBooks}
                    pattern={genre.pattern}
                    color={genre.color}
                  />
                </Link>
              ))
              .concat(
                collections.map((collection) => (
                  <Link
                    key={collection.slug}
                    href={navigation.collections.bySlug(collection.slug)}
                    prefetch
                  >
                    <CollectionCard
                      title={t(`collections.${collection.title}`)}
                      numberOfBooks={collection.bookIds.length}
                      pattern={collection.pattern}
                      color={collection.color}
                    />
                  </Link>
                )),
              )}
          />
        </div>

        <div>
          <HomepageSection
            title={t("home.sections.popular-texts")}
            href="/texts"
            constraintWidth
            items={popularBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
                      coverUrl: text.coverImageUrl,
                      primaryNames: text.primaryNameTranslations,
                    },
                  } as any
                }
                view="grid"
              />
            ))}
          />
        </div>

        <div>
          <HomepageSection
            title={t("home.sections.islamic-law")}
            constraintWidth
            items={popularIslamicLawBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
                      coverUrl: text.coverImageUrl,
                      primaryNames: text.primaryNameTranslations,
                    },
                  } as any
                }
                view="grid"
              />
            ))}
          />
        </div>

        <div>
          <HomepageSection
            title={t("home.sections.islamic-history")}
            constraintWidth
            items={popularIslamicHistoryBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
                      coverUrl: text.coverImageUrl,
                      primaryNames: text.primaryNameTranslations,
                    },
                  } as any
                }
                view="grid"
              />
            ))}
          />
        </div>
      </Container>

      <Footer />
    </>
  );
}

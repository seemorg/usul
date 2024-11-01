/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import Container from "@/components/ui/container";
import Navbar from "../_components/navbar";
import SearchBar from "../_components/navbar/search-bar";
import { Link } from "@/navigation";
import BookSearchResult from "@/components/book-search-result";

import Footer from "../_components/footer";
import { collections } from "@/data/collections";
import { navigation } from "@/lib/urls";
import {
  fetchPopularBooks,
  fetchPopularIslamicHistoryBooks,
  fetchPopularIslamicLawBooks,
} from "@/data/popular-books";
import HomepageSection from "../_components/homepage-section";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { type AppLocale, locales } from "~/i18n.config";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { CollectionCard } from "@/components/ui/collection-card";
import { PlayIcon } from "@heroicons/react/24/solid";

import { cn } from "@/lib/utils";
import { DemoButton } from "./demo-button";

export const generateMetadata = ({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) => getMetadata({ pagePath: "/", locale });

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) {
  unstable_setRequestLocale(locale);

  const pathLocale = appLocaleToPathLocale(locale);

  const [popularBooks, popularIslamicLawBooks, popularIslamicHistoryBooks] =
    await Promise.all([
      fetchPopularBooks(pathLocale),
      fetchPopularIslamicLawBooks(pathLocale),
      fetchPopularIslamicHistoryBooks(pathLocale),
    ]);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <Navbar layout="home" />

      <div className="relative flex min-h-[470px] w-full pb-10 pt-24 text-white sm:pt-28">
        <div className="absolute inset-0 z-0 h-full w-full bg-primary" />
        {/* [clip-path:ellipse(130%_100%_at_50%_0%)] */}

        <Container className="z-[1] flex flex-col items-center">
          <h1 className="text-center text-4xl font-bold sm:text-5xl">
            {t("headline")}
          </h1>

          <p className="mt-5 text-center text-xl font-light text-white/80">
            {t("subheadline")}
          </p>

          <div className="mt-7 flex w-full justify-center">
            <DemoButton>
              <PlayIcon className="size-4" />
              {t("how-usul-works")} - 2:40
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
            title={t("sections.collections")}
            items={collections.map((collection) => (
              <Link
                href={navigation.genres.bySlug(collection.genre)}
                key={collection.genre}
                prefetch
              >
                <CollectionCard
                  title={t(`collections.${collection.name}`)}
                  numberOfBooks={collection.numberOfBooks}
                  pattern={collection.pattern}
                  color={collection.color}
                />
              </Link>
            ))}
          />
        </div>

        <div>
          <HomepageSection
            title={t("sections.popular-texts")}
            href="/texts"
            constraintWidth
            items={popularBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
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
            title={t("sections.islamic-law")}
            constraintWidth
            items={popularIslamicLawBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
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
            title={t("sections.islamic-history")}
            constraintWidth
            items={popularIslamicHistoryBooks.map((text) => (
              <BookSearchResult
                prefetch
                result={
                  {
                    document: {
                      ...text,
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

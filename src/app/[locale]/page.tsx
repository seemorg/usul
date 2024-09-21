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
// import { ArabicLogo } from "@/components/Icons";
import { getMetadata } from "@/lib/seo";
import { type AppLocale, locales } from "~/i18n.config";
import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils";
import { CollectionCard } from "@/components/ui/collection-card";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon } from "lucide-react";
// import { PlayCircleIcon } from "@heroicons/react/24/solid";

const searchExamples = [
  {
    title: "الأشباه والنظائر",
    href: navigation.books.reader("ashbah-1"),
  },
  {
    title: "Al Risala",
    href: navigation.books.reader("risala"),
  },
  {
    title: "Ibn Al-Jawzi",
    href: navigation.authors.bySlug("ibn-jawzi"),
  },
  {
    title: "Iraq",
    href: navigation.regions.bySlug("iraq"),
  },
  {
    title: "Fiqh",
    href: navigation.genres.bySlug("fiqh"),
  },
];

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

  const pathLocale = supportedBcp47LocaleToPathLocale(locale);

  const [popularBooks, popularIslamicLawBooks, popularIslamicHistoryBooks] =
    await Promise.all([
      fetchPopularBooks(pathLocale),
      fetchPopularIslamicLawBooks(pathLocale),
      fetchPopularIslamicHistoryBooks(pathLocale),
    ]);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <Navbar isHomepage />

      <div className="relative flex h-[450px] w-full pt-28 text-white sm:h-[610px] sm:pt-36">
        <div className="absolute inset-0 z-0 h-full w-full bg-primary [clip-path:ellipse(130%_100%_at_50%_0%)]" />

        <Container className="z-[1] flex flex-col items-center">
          {/* <h1 className="font-rakkas -mt-6 text-5xl sm:text-8xl">أصول</h1> */}
          {/* <ArabicLogo className="h-16 w-auto sm:h-24" aria-label="أصول" /> */}
          <h1 className="max-w-[600px] text-center text-5xl font-bold">
            8,000+ Classical Islamic Texts and more
          </h1>

          {/* <p className="mt-5 text-lg">{t("headline")}</p> */}
          <p className="mt-5 max-w-[400px] text-center text-xl font-light text-white/80">
            Discover, search, and research Islamic texts from the OpenITI
            corpus.
          </p>

          <Button
            variant="ghost"
            className="mt-6 h-14 gap-2 bg-accent/10 px-5 py-3 font-medium hover:bg-accent/20 focus:bg-accent/20"
            rounded="full"
            size="lg"
          >
            <PlayCircleIcon className="size-7 fill-white [&_polygon]:fill-primary [&_polygon]:stroke-primary" />
            How Usul Works - 2:20
          </Button>

          <div className="mt-8 w-full">
            <div className="mx-auto max-w-[46rem]">
              <SearchBar size="lg" />
            </div>

            <div className="mx-auto mt-6 flex max-w-[300px] flex-wrap items-center justify-center gap-4 sm:max-w-full">
              {/* <span>{t("try")}</span> */}

              {searchExamples.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  className="font-medium text-primary-foreground underline underline-offset-1"
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-4 py-10 sm:gap-12 sm:py-24">
        <div>
          <HomepageSection
            title={t("sections.collections")}
            items={collections.map((collection) => (
              <Link
                href={navigation.genres.bySlug(collection.genre)}
                key={collection.genre}
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
            items={popularBooks.map((text) => (
              <BookSearchResult
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
            items={popularIslamicLawBooks.map((text) => (
              <BookSearchResult
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
            items={popularIslamicHistoryBooks.map((text) => (
              <BookSearchResult
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

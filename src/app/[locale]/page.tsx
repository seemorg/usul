/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import Container from "@/components/ui/container";
import Navbar from "../_components/navbar";
import SearchBar from "../_components/navbar/search";
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
import { ArabicLogo } from "@/components/Icons";
import { CloudflareImage } from "@/components/cloudflare-image";
import { getMetadata } from "@/lib/seo";
import { searchExamples } from "@/data/search-examples";
import type { LocalePageParams } from "@/types/localization";
import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils";

export function generateMetadata({ params: { locale } }: LocalePageParams) {
  return getMetadata({ pagePath: "/", locale });
}

export default async function HomePage({
  params: { locale },
}: LocalePageParams) {
  unstable_setRequestLocale(locale);

  const pathLocale = supportedBcp47LocaleToPathLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const [popularBooks, popularIslamicLawBooks, popularIslamicHistoryBooks] =
    await Promise.all([
      fetchPopularBooks(pathLocale),
      fetchPopularIslamicLawBooks(pathLocale),
      fetchPopularIslamicHistoryBooks(pathLocale),
    ]);

  return (
    <>
      <Navbar isHomepage />

      <div className="flex h-[450px] w-full bg-primary pt-28 text-white sm:h-[500px] sm:pt-32">
        <Container className="flex flex-col items-center">
          <ArabicLogo className="h-16 w-auto sm:h-24" aria-label="أصول" />

          <p className="mt-5 text-lg">{t("headline")}</p>

          <div className="mt-14 w-full sm:mt-[4.5rem]">
            <div className="mx-auto max-w-[52rem]">
              <SearchBar size="lg" />
            </div>

            <div className="mx-auto mt-4 flex max-w-[300px] flex-wrap items-center justify-center gap-2 sm:max-w-full">
              <span>{t("try")}</span>

              {searchExamples.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  className="font-medium text-primary-foreground underline"
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-4 bg-background py-10 sm:gap-12 sm:py-24">
        <div>
          <HomepageSection
            title={t("sections.collections")}
            items={collections.map((collection) => (
              <Link
                href={navigation.genres.bySlug(collection.genre)}
                key={collection.genre}
              >
                <div className="relative block h-[140px] w-full overflow-hidden rounded-md bg-gray-200 sm:h-[160px] md:h-[180px]">
                  <CloudflareImage
                    src={`https://assets.usul.ai/collections${collection.image}`}
                    alt={collection.name}
                    width={500}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover"
                    placeholder="empty"
                  />
                </div>

                <p className="mt-2 text-base font-medium sm:text-lg">
                  {t(`collections.${collection.name}`)}
                </p>
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

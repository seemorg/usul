import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import Container from "@/components/ui/container";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("meta");

  return getMetadata({
    locale,
    pagePath: navigation.about(),
    title: t("about-page.title"),
    description: t("about-page.description"),
  });
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeFromParams } = await params;
  const locale = appLocaleToPathLocale(localeFromParams);
  const t = await getTranslations("about");

  try {
    const Content = (await import(`~/content/about/${locale}.mdx`)).default;

    return (
      <Container className="max-w-4xl pt-8 lg:pt-12 2xl:max-w-4xl">
        <h1 className="text-4xl font-bold lg:text-5xl">{t("about")}</h1>

        <article className="prose prose-lg dark:prose-invert prose-headings:mb-2 prose-p:mb-2 prose-ul:mt-0 prose-ul:list-none mt-10">
          <Content />
        </article>
      </Container>
    );
  } catch (error) {
    console.log(error);

    notFound();
  }
}

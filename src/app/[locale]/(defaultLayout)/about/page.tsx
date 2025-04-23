import Container from "@/components/ui/container";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { AppLocale } from "~/i18n.config";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
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
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale: localeFromParams } = await params;
  const locale = appLocaleToPathLocale(localeFromParams);
  const t = await getTranslations("about");

  try {
    const Content = (await import(`~/content/about/${locale}.mdx`)).default;

    return (
      <Container className="max-w-4xl pt-16">
        <h1 className="mb-15 text-5xl font-bold">{t("about")}</h1>

        <article className="prose prose-xl mt-14 dark:prose-invert prose-headings:mb-2 prose-p:mb-2 prose-ul:mt-0 prose-ul:list-none">
          <Content />
        </article>
      </Container>
    );
  } catch (error) {
    console.log(error);

    notFound();
  }
}

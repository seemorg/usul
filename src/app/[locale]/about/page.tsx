import Container from "@/components/ui/container";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { AppLocale } from "~/i18n.config";

export default async function AboutPage({
  params,
}: {
  params: { locale: AppLocale };
}) {
  const locale = appLocaleToPathLocale(params.locale);
  const t = await getTranslations("about");

  try {
    const Content = (await import(`./${locale}.mdx`)).default;

    return (
      <Container className="max-w-4xl pt-16">
        <h1 className="mb-15 text-5xl font-bold">{t("about-us")}</h1>

        <article className="prose prose-xl prose-headings:mb-2 prose-p:mb-2 prose-ul:mt-0 prose-ul:list-none dark:prose-invert mt-14">
          <Content />
        </article>
      </Container>
    );
  } catch (error) {
    console.log(error);

    notFound();
  }
}

import type { Locale } from "next-intl";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AIRTABLE_FORMS } from "@/lib/constants";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ locale: Locale; formId: string }>;
}) => {
    const { locale, formId } = await params;

    const t = await getTranslations({ locale, namespace: "meta" });

    return getMetadata({
        pagePath: navigation.form(formId),
        locale,
        title: t("form-page.title"),
        description: t("form-page.description"),
    });
};

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: Locale; formId: string }>;
}) {
    const { locale, formId } = await params;
    setRequestLocale(locale);

    const formConfig = Object.values(AIRTABLE_FORMS).find((f) => f.id === formId);
    const containerHeight = formConfig?.height ?? AIRTABLE_FORMS.FEEDBACK.height;

    return (
        <Container className="py-26 md:pt-36" style={{ height: containerHeight }}>
            <iframe
                title="Airtable form"
                className="airtable-embed h-full w-full rounded-2xl border-none"
                src={`https://airtable.com/embed/appGgKaF9kTWqtppC/${formId}/form`}
                width="100%"
                height="100%"
                style={{ background: "transparent", border: "0px solid #ccc" }}
                allowFullScreen
            />
        </Container>
    );
}

import type { Locale } from "next-intl";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import EditUser from "./edit-user";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("meta");

  return getMetadata({
    locale,
    pagePath: navigation.profile(),
    title: t("profile-page.title"),
    description: t("profile-page.description"),
  });
};

export default function ProfilePage() {
  const t = useTranslations("common");

  return (
    <Container className="max-w-4xl pt-8 lg:pt-12 2xl:max-w-4xl">
      <h1 className="text-4xl font-bold lg:text-5xl">{t("profile")}</h1>

      <div className="mt-10">
        <EditUser />
      </div>
    </Container>
  );
}

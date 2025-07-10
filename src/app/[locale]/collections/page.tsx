import type { Locale } from "next-intl";
import RequireAuth from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import CollectionsList, { CollectionsListSkeleton } from "./collections-list";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("meta");

  return getMetadata({
    locale,
    pagePath: navigation.collections.all(),
    title: t("collections-page.title"),
    description: t("collections-page.description"),
  });
};

export default function CollectionsPage() {
  const t = useTranslations();

  return (
    <Container className="max-w-4xl pt-8 lg:pt-12 2xl:max-w-4xl">
      <div className="flex items-center justify-between gap-10">
        <h1 className="text-4xl font-bold lg:text-5xl">
          {t("collections.my-collections")}
        </h1>

        <Button asChild className="gap-2 rounded-full">
          <Link href={navigation.collections.add()}>
            <PlusIcon className="size-4" />
            {t("common.create")}
          </Link>
        </Button>
      </div>

      <div className="mt-10">
        <RequireAuth skeleton={<CollectionsListSkeleton />}>
          <CollectionsList />
        </RequireAuth>
      </div>
    </Container>
  );
}

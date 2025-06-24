import type { Locale } from "next-intl";
import RequireAuth from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import CollectionForm from "../collection-form";
import CollectionFormSkeleton from "../collection-form-skeleton";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations();

  return getMetadata({
    locale,
    pagePath: navigation.collections.add(),
    title: t("common.create-x", { entity: t("entities.collection") }),
  });
};

export default function AddCollectionPage() {
  const t = useTranslations();

  return (
    <Container className="max-w-4xl pt-8 lg:pt-12 2xl:max-w-4xl">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="ghost" className="hover:bg-accent">
          <Link href={navigation.collections.all()}>
            <ArrowLeftIcon className="size-8" />
          </Link>
        </Button>

        <h1 className="text-4xl font-bold lg:text-5xl">
          {t("common.create-x", { entity: t("entities.collection") })}
        </h1>
      </div>

      <div className="mt-10">
        <RequireAuth skeleton={<CollectionFormSkeleton />}>
          <CollectionForm mode="create" />
        </RequireAuth>
      </div>
    </Container>
  );
}

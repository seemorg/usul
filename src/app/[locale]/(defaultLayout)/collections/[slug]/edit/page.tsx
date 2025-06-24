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

import CollectionFormSkeleton from "../../collection-form-skeleton";
import EditCollectionForm from "./edit-collection-form";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) => {
  const { locale, slug } = await params;
  const t = await getTranslations();

  return getMetadata({
    locale,
    pagePath: navigation.collections.edit(slug),
    title: t("common.edit-x", { entity: t("entities.collection") }),
  });
};

export default function EditCollectionPage() {
  const t = useTranslations();

  return (
    <Container className="pt-8 lg:pt-12">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="ghost" className="hover:bg-accent">
          <Link href={navigation.collections.all()}>
            <ArrowLeftIcon className="size-8" />
          </Link>
        </Button>

        <h1 className="text-4xl font-bold lg:text-5xl">
          {t("common.edit-x", { entity: t("entities.collection") })}
        </h1>
      </div>

      <div className="mt-10">
        <RequireAuth skeleton={<CollectionFormSkeleton />}>
          <EditCollectionForm />
        </RequireAuth>
      </div>
    </Container>
  );
}

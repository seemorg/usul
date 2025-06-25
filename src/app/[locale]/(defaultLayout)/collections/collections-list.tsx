"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useCollections } from "@/react-query/queries/collections";
import { EditIcon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const CollectionsListSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-lg border p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />

        <div className="mt-4 flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export default function CollectionsList() {
  const t = useTranslations();
  const { data, isLoading } = useCollections();

  if (isLoading) {
    return <CollectionsListSkeleton />;
  }

  if (!data?.data.length) {
    return (
      <Alert>
        <AlertDescription>
          {t("entities.no-entity", { entity: t("entities.collections") })}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.data.map((collection) => (
        <div
          key={collection.id}
          className="flex flex-col justify-between gap-4 rounded-lg border p-6"
        >
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{collection.name}</h3>
              <Badge
                variant={
                  collection.visibility === "PUBLIC" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {collection.visibility === "PUBLIC"
                  ? t("collections.visibility.public")
                  : t("collections.visibility.unlisted")}
              </Badge>
            </div>

            {collection.description && (
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {collection.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Link href={navigation.collections.bySlug(collection.slug)}>
                <EyeIcon className="size-4" />
                {t("common.view")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Link href={navigation.collections.edit(collection.slug)}>
                <EditIcon className="size-4" />
                {t("common.edit")}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

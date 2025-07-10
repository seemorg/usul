"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useCollections } from "@/react-query/queries/collections";
import { useTranslations } from "next-intl";

import DeleteCollectionModal from "./delete-collection-modal";
import EditCollectionModal from "./edit-collection-modal";

export const CollectionsListSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-card flex flex-col justify-between rounded-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        <Skeleton className="mt-4 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-3/4" />

        <div className="mt-5 flex items-center justify-between">
          <Skeleton className="h-9 w-16 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.data.map((collection) => (
        <div
          key={collection.id}
          className="bg-card flex flex-col justify-between rounded-2xl p-5"
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{collection.name}</h3>
            <Badge variant="secondary" className="rounded-full capitalize">
              {collection.visibility === "PUBLIC"
                ? t("collections.visibility.public")
                : t("collections.visibility.unlisted")}
            </Badge>
          </div>

          {collection.description && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {collection.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <div>
              <Button asChild className="flex-1 gap-2 rounded-full">
                <Link href={navigation.collections.bySlug(collection.slug)}>
                  {t("common.view")}
                </Link>
              </Button>
            </div>

            <div>
              <EditCollectionModal slug={collection.slug} />

              <DeleteCollectionModal
                collectionId={collection.id}
                collectionName={collection.name}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

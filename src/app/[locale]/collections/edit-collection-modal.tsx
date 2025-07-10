"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCollectionBySlug } from "@/react-query/queries/collections";
import { PenLineIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import CollectionForm from "./collection-form";
import CollectionFormSkeleton from "./collection-form-skeleton";

interface EditCollectionModalProps {
  slug: string;
}

export default function EditCollectionModal({
  slug,
}: EditCollectionModalProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const { data: collectionData, isLoading } = useCollectionBySlug(
    isOpen ? slug : "",
  );
  const collection = collectionData?.data;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent text-muted-foreground"
          tooltip={t("common.edit")}
        >
          <PenLineIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("common.edit-x", { entity: t("entities.collection") })}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <CollectionFormSkeleton />
          ) : collection ? (
            <CollectionForm
              mode="edit"
              initialData={{
                name: collection.name,
                description: collection.description,
                slug: collection.slug,
                visibility: collection.visibility,
              }}
              collectionId={collection.id}
              onSuccess={() => {
                setIsOpen(false);
              }}
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              {t("common.error")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

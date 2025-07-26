"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteCollection } from "@/react-query/mutations/collections";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteCollectionModalProps {
  collectionId: string;
  collectionName: string;
}

export default function DeleteCollectionModal({
  collectionId,
  collectionName,
}: DeleteCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteCollection();
  const t = useTranslations();

  const handleDelete = () => {
    mutate(collectionId, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isPending && !open) return;
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent text-muted-foreground"
          tooltip={t("common.delete")}
          tooltipProps={{ variant: "primary" }}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("common.delete-confirmation.title")}</DialogTitle>
          <DialogDescription className="mt-1">
            {t("common.delete-confirmation.description", {
              entity: `"${collectionName}"`,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isPending}
          >
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

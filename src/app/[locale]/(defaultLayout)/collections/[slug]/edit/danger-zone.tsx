import type { Collection } from "@/types/api/collection";
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
import { useDeleteCollection } from "@/queries/collections";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DangerZone({ collection }: { collection: Collection }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteCollection();
  const t = useTranslations();

  const handleDelete = () => {
    mutate(collection.id);
    setIsOpen(false);
  };

  return (
    <div>
      <div>
        <h3 className="text-lg font-semibold">
          {t("collections.danger-zone.title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("collections.danger-zone.description")}
        </p>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (isPending && !open) return;
          setIsOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-4 gap-2">
            <TrashIcon className="size-4" />
            {t("common.delete-x", { entity: t("entities.collection") })}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.delete-confirmation.title")}</DialogTitle>
            <DialogDescription className="mt-1">
              {t("common.delete-confirmation.description", {
                entity: t("entities.collection"),
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
    </div>
  );
}

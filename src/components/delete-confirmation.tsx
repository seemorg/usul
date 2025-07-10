import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DeleteConfirmationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  entity?: string;
  confirmText?: string;
  onConfirm: () => void;
  className?: string;
}

export function DeleteConfirmation({
  isOpen,
  setIsOpen,
  title,
  description,
  entity = "item",
  confirmText,
  onConfirm,
  className,
}: DeleteConfirmationProps) {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("common");

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
    setInputValue("");
  };

  const isConfirmDisabled = confirmText ? inputValue !== confirmText : false;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title || t("delete-confirmation.title")}</DialogTitle>
          <DialogDescription>
            {description || t("delete-confirmation.description", { entity })}
          </DialogDescription>
        </DialogHeader>
        {confirmText && (
          <div className="py-4">
            <p className="text-muted-foreground mb-2 text-sm">
              {t.rich("delete-confirmation.type-to-confirm", {
                text: confirmText,
              })}
            </p>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setInputValue("");
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

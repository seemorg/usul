"use client";

import { useTranslations } from "next-intl";

import NewsletterForm from "./newsletter-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ComingSoonModal({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("coming-soon.title")}</DialogTitle>
        </DialogHeader>

        <div>
          <p>{t("coming-soon.message")}</p>

          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

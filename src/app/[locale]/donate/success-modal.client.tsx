"use client";

import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SuccessModal() {
  const success = useSearchParams().get("status") === "success";
  const t = useTranslations("donate.success");

  return (
    <Dialog defaultOpen={success}>
      <DialogContent className="py-12 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <div className="mb-5 flex items-center justify-center">
              <HeartIcon className="size-14 text-red-500" />
            </div>
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center text-lg">
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

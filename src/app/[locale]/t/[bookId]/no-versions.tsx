"use client";

import { FileQuestionIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import BookInfo from "./_components/reader-content/book-info";

export default function NoVersions() {
  const t = useTranslations("reader");

  return (
    <div>
      <div className="w-full px-5 lg:px-8">
        <BookInfo className="mx-auto max-w-5xl py-8" />
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <FileQuestionIcon className="text-muted-foreground size-16" />
        <h3 className="mt-4 text-xl font-medium">{t("no-versions.title")}</h3>
        <p className="text-secondary-foreground mt-2">
          {t("no-versions.description")}
        </p>
      </div>
    </div>
  );
}

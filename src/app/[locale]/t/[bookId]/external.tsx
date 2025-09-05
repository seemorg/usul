"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, FileQuestionIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import BookInfo from "./_components/reader-content/book-info";
import { useBookDetails } from "./_contexts/book-details.context";

export default function ExternalBook() {
  const t = useTranslations("reader");
  const bookResponse = useBookDetails();

  if (bookResponse.bookResponse.content.source !== "external") return null;

  return (
    <div>
      <div className="w-full px-5 lg:px-8">
        <BookInfo className="mx-auto max-w-5xl py-8" />
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <FileQuestionIcon className="text-muted-foreground size-16" />

        <h3 className="mt-4 text-xl font-medium">{t("external-book.title")}</h3>

        <p className="text-secondary-foreground mt-2">
          {t("external-book.description")}
        </p>

        <Button asChild variant="default" className="mt-6 gap-2">
          <a href={bookResponse.bookResponse.content.url}>
            {t("external-book.navigate")}
            <ArrowUpRightIcon className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

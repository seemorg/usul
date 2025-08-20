"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SourceModal } from "@/components/ui/source-modal";
import { removeDiacritics } from "@/lib/diacritics";
import { cn } from "@/lib/utils";
import { BookContentSearchResult } from "@/types/search";
import { useTranslations } from "next-intl";

export const BookContentResult = ({
  result,
  className,
}: {
  result: BookContentSearchResult;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const page = result.node.metadata.pages[0];

  const text = result.node.highlights
    ? result.node.highlights.join("<br>...<br>")
    : removeDiacritics(result.node.text).replaceAll("\n", "<br>");

  return (
    <>
      <div
        className={cn(
          "bg-card border-border flex w-sm cursor-pointer flex-col gap-4 rounded-xl border px-6 py-5 md:w-md lg:w-lg",
          className,
        )}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior that may cause modal to close
            setIsOpen(true);
          }
        }}
        aria-pressed={isOpen}
        aria-expanded={isOpen}
      >
        <bdi
          className="font-scheherazade [&>em]:text-primary line-clamp-5 block max-h-[150px] w-full overflow-ellipsis sm:text-xl/relaxed [&>em]:font-bold [&>em]:not-italic"
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />

        {page && (
          <div className="text-muted-foreground text-xs" dir="rtl">
            {page?.volume && (
              <span>
                {isNaN(Number(page.volume))
                  ? page.volume
                  : t("common.pagination.vol-x", { volume: page.volume })}{" "}
                /{" "}
              </span>
            )}
            <span>
              {t("common.pagination.page-x", { page: page ? page.page : -1 })}
            </span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-xs">
          <div className="flex-1">
            <p className="font-medium">{result.book.primaryName}</p>
            <p className="text-muted-foreground mt-1">
              {result.book.author.primaryName}
            </p>
          </div>

          <div className="flex-1">
            <bdi className="block font-medium">{result.book.secondaryName}</bdi>
            <bdi className="text-muted-foreground mt-1 block">
              {result.book.author.secondaryName}
            </bdi>
          </div>
        </div>
      </div>

      <SourceModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        sources={[{ ...result.node, book: result.book }]}
      />
    </>
  );
};

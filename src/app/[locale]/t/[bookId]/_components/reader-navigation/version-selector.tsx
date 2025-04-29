"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { versionToName } from "@/lib/version";
import { ChevronsUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import EditionModal from "./edition-modal";

export default function VersionSelector({
  versions,
  versionId,
}: {
  versions: PrismaJson.BookVersion[];
  versionId: string;
}) {
  const t = useTranslations("reader");
  const selectedVersionObj = versions.find((v) => v.id === versionId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EditionModal
        versions={versions}
        versionId={versionId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      <div className="group flex items-center" onClick={() => setIsOpen(true)}>
        <div className="border-border text-muted-foreground hidden h-9 items-center justify-center rounded-md border px-4 md:flex ltr:rounded-r-none rtl:rounded-l-none">
          <p className="text-sm">{t("edition")}</p>
        </div>

        <button
          className={cn(
            "border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            "border-border group-hover:bg-accent w-[170px] overflow-hidden border px-2 shadow-none transition-colors md:w-[200px] md:px-3 md:ltr:rounded-l-none md:ltr:border-l-0 md:rtl:rounded-r-none md:rtl:border-r-0 [&>span]:max-w-[90%] [&>span]:min-w-0 [&>span]:break-words [&>span]:text-ellipsis",
          )}
        >
          {selectedVersionObj ? (
            <span>{versionToName(selectedVersionObj)}</span>
          ) : (
            <span>{t("select-edition")}</span>
          )}

          <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
        </button>
      </div>
    </>
  );
}

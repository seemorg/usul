"use client";

import { versionToName } from "@/lib/version";
import { useTranslations } from "next-intl";
import EditionModal from "./edition-modal";

import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

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
        <div className="hidden h-9 items-center justify-center rounded-md border border-border px-4 text-muted-foreground md:flex ltr:rounded-r-none rtl:rounded-l-none">
          <p className="text-sm">{t("edition")}</p>
        </div>

        <button
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            "w-[170px] overflow-hidden border border-border px-2 shadow-none transition-colors group-hover:bg-accent md:w-[200px] md:px-3 ltr:md:rounded-l-none ltr:md:border-l-0 rtl:md:rounded-r-none rtl:md:border-r-0 [&>span]:min-w-0 [&>span]:max-w-[90%] [&>span]:overflow-ellipsis [&>span]:break-words",
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

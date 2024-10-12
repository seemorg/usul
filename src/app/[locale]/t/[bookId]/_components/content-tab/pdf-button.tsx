"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import React from "react";
// import { useTranslations } from "next-intl";
import type { TurathBookResponse } from "@/server/services/books";
import { useSearchParams } from "next/navigation";
import { FileTextIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "@/navigation";

// TODO: localize

export default function PdfButton({
  pdf,
  slug,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
}) {
  // const t = useTranslations("reader");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const router = useRouter();

  const onViewClick = () => {
    const newParams = new URLSearchParams(searchParams);
    if (view === "pdf") {
      newParams.delete("view");
    } else {
      newParams.set("view", "pdf");
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={view === "pdf" ? "default" : "secondary"}
        onClick={onViewClick}
        className="w-full flex-1 gap-2 hover:opacity-80"
        disabled={!pdf?.finalUrl}
      >
        {view === "pdf" ? (
          <XIcon className="h-4 w-4" />
        ) : (
          <FileTextIcon className="h-4 w-4" />
        )}

        {!pdf?.finalUrl
          ? "No PDF Attached"
          : view === "pdf"
            ? "Exit PDF"
            : "View PDF"}
      </Button>

      {pdf?.finalUrl ? (
        <Button variant="secondary" size="icon" tooltip="Download PDF" asChild>
          <a href={pdf?.finalUrl} download={slug + ".pdf"} target="_blank">
            <ArrowDownTrayIcon className="h-4 w-4" />
          </a>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="icon"
          tooltip="Download PDF"
          disabled={!pdf?.finalUrl}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

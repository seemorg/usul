"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { bytesToMB } from "@/lib/utils";
import React from "react";
import { useTranslations } from "next-intl";
import type { TurathBookResponse } from "@/server/services/books";

export default function PdfButton({
  pdf,
  slug,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
}) {
  const t = useTranslations("reader");

  let root = pdf?.root ? pdf.root.replace(/\/$/, "") : null;
  let file = pdf?.files[0];
  if ((pdf?.files?.length ?? 0) > 1) {
    const completeFile = pdf!.files?.find((e) => e.endsWith("|0"));
    if (completeFile) {
      file = completeFile.split("|")[0];
    }
  }

  const finalUrl = (() => {
    if (!file) return undefined;

    let url = `https://files.turath.io/pdf/`;

    if (root) {
      if (root.includes("archive.org")) {
        root = "archive/" + root.replace("https://archive.org/download/", "");
        url += `${root}_=_${file}`;
      } else {
        url += `${root}/${file}`;
      }
    }

    return encodeURI(url);
  })();

  const size = pdf?.size;

  const Wrapper = finalUrl ? "a" : "span";

  return (
    <Button
      variant="secondary"
      asChild={!!finalUrl}
      tooltip={
        finalUrl
          ? size
            ? `${bytesToMB(size)} MB`
            : "Unknown size"
          : "Not available"
      }
      disabled={!finalUrl}
      className="w-full"
    >
      <Wrapper
        href={finalUrl}
        download={slug + ".pdf"}
        target="_blank"
        className="flex w-full justify-center gap-2"
      >
        <ArrowDownTrayIcon className="h-4 w-4" /> {t("download-pdf")}{" "}
        {size && <span className="md:hidden">({bytesToMB(size)} MB)</span>}
      </Wrapper>
    </Button>
  );
}

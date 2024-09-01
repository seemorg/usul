"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { bytesToMB } from "@/lib/utils";
import type { TurathBookResponse } from "@/types/turath/book";
import React from "react";
import { useTranslations } from "next-intl";

export default function PdfButton({
  pdf,
  slug,
}: {
  pdf: TurathBookResponse["meta"]["pdf_links"];
  slug: string;
}) {
  const t = useTranslations("reader");
  const url = pdf?.files[0];
  const size = pdf?.size;

  const Wrapper = url ? "a" : "span";

  return (
    <Button
      variant="secondary"
      asChild={!!url}
      tooltip={
        url
          ? size
            ? `${bytesToMB(size)} MB`
            : "Unknown size"
          : "Not available"
      }
      disabled={!url}
      className="w-full"
    >
      <Wrapper
        href={url}
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

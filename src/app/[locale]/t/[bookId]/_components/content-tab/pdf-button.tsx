"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import React from "react";
import { useTranslations } from "next-intl";
import type { TurathBookResponse } from "@/server/services/books";
import { useSearchParams } from "next/navigation";
import { EyeIcon } from "lucide-react";
import { usePathname, useRouter } from "@/navigation";

export default function PdfButton({
  pdf,
  slug,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
}) {
  const t = useTranslations("reader");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const router = useRouter();

  const size = pdf?.sizeInMb;
  const Wrapper = pdf?.finalUrl ? "a" : "span";

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
        disabled={!pdf?.finalUrl}
        size="icon"
        onClick={onViewClick}
      >
        <EyeIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        asChild={!!pdf?.finalUrl}
        tooltip={
          pdf?.finalUrl
            ? size
              ? `${size} MB`
              : "Unknown size"
            : "Not available"
        }
        disabled={!pdf?.finalUrl}
        className="w-full flex-1"
      >
        <Wrapper
          href={pdf?.finalUrl}
          download={slug + ".pdf"}
          target="_blank"
          className="flex w-full justify-center gap-2"
        >
          <ArrowDownTrayIcon className="h-4 w-4" /> {t("download-pdf")}{" "}
          {size && <span className="md:hidden">({size} MB)</span>}
        </Wrapper>
      </Button>
    </div>
  );
}

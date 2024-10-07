"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import React from "react";
// import { useTranslations } from "next-intl";
import type { TurathBookResponse } from "@/server/services/books";
import { useSearchParams } from "next/navigation";
import { FileTextIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "@/navigation";

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

  // const size = pdf?.sizeInMb;
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
        onClick={onViewClick}
        className="w-full flex-1 gap-2 hover:opacity-80"
      >
        {view === "pdf" ? (
          <XIcon className="h-4 w-4" />
        ) : (
          <FileTextIcon className="h-4 w-4" />
        )}
        {view === "pdf" ? "Exit PDF" : "View PDF"}
      </Button>

      <Button
        variant="secondary"
        size="icon"
        tooltip={"Download PDF"}
        disabled={!pdf?.finalUrl}
        asChild={!!pdf?.finalUrl}
        className="w-[40px]"
      >
        <Wrapper
          href={pdf?.finalUrl}
          download={slug + ".pdf"}
          target="_blank"
          className="flex w-full justify-center gap-2"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </Wrapper>
      </Button>
    </div>
  );
}

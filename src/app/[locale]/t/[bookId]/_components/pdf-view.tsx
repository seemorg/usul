"use client";

import type { TurathBookResponse } from "@/server/services/books";
import { type WebViewerInstance } from "@pdftron/webviewer";
// @ts-ignore
import WebViewer from "@pdftron/pdfjs-express-viewer";
import { useEffect, useRef } from "react";

const isInitializedByUrl = new Map<string, boolean>();

export default function PdfView({
  pdf: pdfSource,
}: {
  pdf: TurathBookResponse["turathResponse"]["pdf"];
}) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: WebViewerInstance | null = null;
    const initialize = async () => {
      if (isInitializedByUrl.get(pdfSource.finalUrl!)) return;

      isInitializedByUrl.set(pdfSource.finalUrl!, true);
      instance = await WebViewer(
        {
          path: "/pdf-express", // point to where the files you copied are served from
          initialDoc: pdfSource.finalUrl!, // path to your document
          enableAnnotations: false,
          licenseKey: "X83MG7YBqueJXUngqbHh",
        },
        viewerRef.current!,
      );
    };

    if (typeof window !== "undefined") {
      initialize();
    }
  }, [pdfSource.finalUrl]);

  return (
    <div className="mx-auto w-full min-w-0 flex-auto pt-28 md:pt-20">
      <div
        ref={viewerRef}
        className="min-h-[87vh] w-full [&_iframe]:min-h-[87vh]"
      />
    </div>
  );
}

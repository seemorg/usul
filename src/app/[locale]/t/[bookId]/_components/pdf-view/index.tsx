"use client";

import type { TurathBookResponse } from "@/server/services/books";
import type {
  Core,
  WebViewerInstance,
  WebViewerOptions,
} from "@pdftron/webviewer";
// @ts-ignore
import WebViewer from "@pdftron/pdfjs-express-viewer";
import { useEffect, useRef } from "react";
import { PdfChapter, usePdfChapterStore } from "./store";
import { useTheme } from "next-themes";

const isInitializedByUrl = new Map<string, boolean>();

export default function PdfView({
  pdf: pdfSource,
}: {
  pdf: TurathBookResponse["turathResponse"]["pdf"];
}) {
  const { resolvedTheme = "light" } = useTheme();
  const viewerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);

  const setChapters = usePdfChapterStore((s) => s.setChapters);
  const setIsLoading = usePdfChapterStore((s) => s.setIsLoading);
  const setNavigateToPage = usePdfChapterStore((s) => s.setNavigateToPage);

  useEffect(() => {
    const initialize = async () => {
      if (isInitializedByUrl.get(pdfSource.finalUrl!)) return;

      isInitializedByUrl.set(pdfSource.finalUrl!, true);
      setIsLoading(true);
      setChapters([]);

      const instance: WebViewerInstance = await WebViewer(
        {
          path: "/pdf-express", // point to where the files you copied are served from
          initialDoc: pdfSource.finalUrl!, // path to your document
          enableAnnotations: false,
          disabledElements: [
            "leftPanel",
            "leftPanelButton",
            "selectToolButton",
            "themeChangeButton",
            "languageButton",
          ],
          licenseKey: "X83MG7YBqueJXUngqbHh",
          // set the theme to dark
        } satisfies WebViewerOptions,
        viewerRef.current!,
      );

      instanceRef.current = instance;

      instance.UI.setTheme(
        resolvedTheme === "dark"
          ? instance.UI.Theme.DARK
          : instance.UI.Theme.LIGHT,
      );

      instance.Core.documentViewer.addEventListener(
        "documentLoaded",
        async () => {
          const chapters = await getDocumentChapters(instance!);

          setChapters(chapters);
          setIsLoading(false);
          setNavigateToPage((page: number) => {
            instance.Core.documentViewer.setCurrentPage(page, false);
          });
        },
      );
    };

    if (typeof window !== "undefined") {
      initialize();
    }
  }, [pdfSource.finalUrl]);

  // when theme changes, update the theme of the viewer
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.UI.setTheme(
        resolvedTheme === "dark"
          ? instanceRef.current.UI.Theme.DARK
          : instanceRef.current.UI.Theme.LIGHT,
      );
    }
  }, [resolvedTheme]);

  return (
    <div className="mx-auto w-full min-w-0 flex-auto pt-28 lg:pt-20">
      <div
        ref={viewerRef}
        className="h-[calc(100vh-7rem)] w-full border-t border-border lg:h-[calc(100vh-5rem)] lg:border-none [&_iframe]:h-[calc(100vh-7rem)] lg:[&_iframe]:h-[calc(100vh-5rem)]"
      />
    </div>
  );
}

async function getDocumentChapters(instance: WebViewerInstance) {
  const { documentViewer } = instance.Core;
  const pdfDoc = documentViewer.getDocument();

  try {
    const bookmarks = await pdfDoc.getBookmarks();
    return parseBookmarks(bookmarks);
  } catch (error) {
    return [];
  }
}

function parseBookmarks(bookmarks: Core.Bookmark[]): PdfChapter[] {
  if (bookmarks.length === 0) return [];

  return bookmarks.map((b) => ({
    id: b.getIndex(),
    title: b.getName(),
    page: b.getPageNumber(),
    children: parseBookmarks(b.getChildren()),
  })) as PdfChapter[];
}

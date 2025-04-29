"use client";

import type {
  Core,
  WebViewerInstance,
  WebViewerOptions,
} from "@pdftron/webviewer";
import { useEffect, useRef } from "react";
import { env } from "@/env";
import { useNavbarStore } from "@/stores/navbar";
// @ts-expect-error - The PDFJS Express Viewer is not typed
import WebViewer from "@pdftron/pdfjs-express-viewer";
import { useTheme } from "next-themes";

import type { PdfChapter } from "./store";
import { makePdfViewerButtons } from "./buttons";
import { usePdfChapterStore } from "./store";

const isInitializedByUrl = new Map<string, boolean>();

export default function PdfView({ pdf: pdfSource }: { pdf: string }) {
  const { resolvedTheme = "light" } = useTheme();
  const viewerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);

  const setChapters = usePdfChapterStore((s) => s.setChapters);
  const setShowNavbar = useNavbarStore((s) => s.setShowNavbar);
  const setIsLoading = usePdfChapterStore((s) => s.setIsLoading);
  const setNavigateToPage = usePdfChapterStore((s) => s.setNavigateToPage);

  useEffect(() => {
    const initialize = async () => {
      if (!pdfSource) return;

      if (isInitializedByUrl.get(pdfSource)) return;

      isInitializedByUrl.set(pdfSource, true);
      setIsLoading(true);
      setChapters([]);

      const instance: WebViewerInstance = await WebViewer(
        {
          path: "/pdf-express", // point to where the files you copied are served from
          initialDoc: pdfSource, // path to your document
          enableAnnotations: false,
          disabledElements: [
            // "selectToolButton",
            "leftPanel",
            "leftPanelButton",
            "menuButton",
            "themeChangeButton",
            "languageButton",
          ],

          licenseKey: env.NEXT_PUBLIC_PDF_EXPRESS_LICENSE_KEY,
          // set the theme to dark
        } satisfies WebViewerOptions,
        viewerRef.current!,
      );

      instanceRef.current = instance;

      instance.UI.setHeaderItems((headers) => {
        const buttons = makePdfViewerButtons(instance);
        buttons.forEach((b) => headers.push(b));
      });

      instance.UI.setTheme(
        resolvedTheme === "dark"
          ? instance.UI.Theme.DARK
          : instance.UI.Theme.LIGHT,
      );

      instance.Core.documentViewer.addEventListener(
        "documentLoaded",
        async () => {
          const chapters = await getDocumentChapters(instance);

          setChapters(chapters);
          setIsLoading(false);
          setNavigateToPage((page: number) => {
            instance.Core.documentViewer.setCurrentPage(page, false);
          });
        },
      );
    };

    if (typeof window !== "undefined") {
      void initialize();
    }
  }, [pdfSource]);

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

  useEffect(() => {
    setShowNavbar(true);
  }, [setShowNavbar]);

  return (
    <div className="mx-auto w-full min-w-0 flex-auto">
      <div
        ref={viewerRef}
        className="border-border h-[calc(100vh-7rem)] w-full border-t lg:h-[calc(100vh-5rem)] lg:border-none [&_iframe]:h-[calc(100vh-7rem)] lg:[&_iframe]:h-[calc(100vh-5rem)]"
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
  } catch {
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

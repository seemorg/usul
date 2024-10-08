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
import { type PdfChapter, usePdfChapterStore } from "./store";
import { useTheme } from "next-themes";
import { env } from "@/env";

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
            // "selectToolButton",
            "themeChangeButton",
            "languageButton",
          ],

          licenseKey: env.NEXT_PUBLIC_PDF_EXPRESS_LICENSE_KEY,
          // set the theme to dark
        } satisfies WebViewerOptions,
        viewerRef.current!,
      );

      const downloadButton = {
        type: "actionButton",
        img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - download</title><path class="cls-1" d="M11.55,17,5.09,9.66a.6.6,0,0,1,.45-1H8.67V2.6a.6.6,0,0,1,.6-.6h5.46a.6.6,0,0,1,.6.6V8.67h3.13a.6.6,0,0,1,.45,1L12.45,17A.6.6,0,0,1,11.55,17ZM3.11,20.18V21.6a.4.4,0,0,0,.4.4h17a.4.4,0,0,0,.4-.4V20.18a.4.4,0,0,0-.4-.4h-17A.4.4,0,0,0,3.11,20.18Z"></path></svg>`,
        onClick: () => {
          instance.UI.downloadPdf();
        },
        dataElement: "downloadButton",
      };

      //       const fullscreenButton: Web = {
      //   type: 'statefulButton',
      //   initialState: 'minimized',
      //   states: {
      //     minimized: {
      //       img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen</title><path class="cls-1" d="M4.22,4.22H9.78V2H2V9.78H4.22ZM9.78,19.78H4.22V14.22H2V22H9.78ZM22,14.22H19.78v5.56H14.22V22H22ZM19.78,9.78H22V2H14.22V4.22h5.56Z"></path></svg>`,
      //       onClick: (update, activeState) => {
      //         activeState.number += 1;
      //         update();
      //       }
      //     },
      //     full: {
      //       img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen - exit</title><path class="cls-1" d="M9.5,2H7V7H2V9.5H9.5ZM7,22H9.5V14.5H2V17H7Zm15-7.5H14.5V22H17V17h5ZM22,7H17V2H14.5V9.5H22Z"></path></svg>`,
      //       onClick: (update, activeState) => {
      //         activeState.number += 1;
      //         update();
      //       }
      //     }
      //   },
      //   mount: update => {
      //     const fitModeToState = fitMode => {
      //       // the returned state should be the opposite of the new current state
      //       // as the opposite state is what we want to switch to when the button
      //       // is clicked next
      //       if (fitMode === instance.UI.FitMode.FitPage) {
      //         return 'FitWidth';
      //       } else if (fitMode === instance.UI.FitMode.FitWidth) {
      //         return 'FitPage';
      //       }
      //     };

      //     instance.Core.documentViewer.addEventListener('fitModeUpdated.fitbutton', fitMode => {
      //       update(fitModeToState(fitMode));
      //     });
      //   },
      //   unmount: () => {
      //     instance.Core.documentViewer.removeEventListener('fitModeUpdated.fitbutton');
      //   },
      //   dataElement: 'countButton'
      // };

      // full screen icon
      // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen</title><path class="cls-1" d="M4.22,4.22H9.78V2H2V9.78H4.22ZM9.78,19.78H4.22V14.22H2V22H9.78ZM22,14.22H19.78v5.56H14.22V22H22ZM19.78,9.78H22V2H14.22V4.22h5.56Z"></path></svg>

      // exit full screen
      // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen - exit</title><path class="cls-1" d="M9.5,2H7V7H2V9.5H9.5ZM7,22H9.5V14.5H2V17H7Zm15-7.5H14.5V22H17V17h5ZM22,7H17V2H14.5V9.5H22Z"></path></svg>

      instanceRef.current = instance;

      instance.UI.setHeaderItems((headers) => {
        headers.push(downloadButton);
      });

      instance.UI.setTheme(
        resolvedTheme === "dark"
          ? instance.UI.Theme.DARK
          : instance.UI.Theme.LIGHT,
      );

      // enable text selection
      // instance.Core.documentViewer.getSelectedText(true);

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

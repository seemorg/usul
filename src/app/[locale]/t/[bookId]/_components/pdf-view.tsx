"use client";

import type { TurathBookResponse } from "@/server/services/books";
import { type WebViewerInstance } from "@pdftron/webviewer";
// @ts-ignore
import WebViewer from "@pdftron/pdfjs-express-viewer";
import { useEffect, useRef, useState } from "react";

// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/web/pdf_viewer.css";

// // Import the worker from pdfjs-dist
// import { GlobalWorkerOptions } from "pdfjs-dist";

// // Set the workerSrc property
// if (typeof window !== "undefined") {
//   GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker.js`;
// }
let isInitialized = false;

export default function PdfView({
  pdf: pdfSource,
}: {
  pdf: TurathBookResponse["turathResponse"]["pdf"];
}) {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  // const [pageNum, setPageNum] = useState(1);
  // const [numPages, setNumPages] = useState<number | null>(null);
  // const [isRendering, setIsRendering] = useState(false);

  // useEffect(() => {
  //   const loadingTask = pdfjsLib.getDocument(pdfSource.finalUrl!);
  //   loadingTask.promise
  //     .then((loadedPdf) => {
  //       setPdf(loadedPdf);
  //       setNumPages(loadedPdf.numPages);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading PDF:", error);
  //     });
  // }, [pdfSource.finalUrl]);

  // useEffect(() => {
  //   const renderPage = async (num: number) => {
  //     if (pdf) {
  //       setIsRendering(true);
  //       const page = await pdf.getPage(num);
  //       const viewport = page.getViewport({ scale: 1.5 });
  //       const canvas = canvasRef.current!;
  //       const context = canvas.getContext("2d");
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;

  //       const renderContext = {
  //         canvasContext: context!,
  //         viewport: viewport,
  //       };

  //       await page.render(renderContext).promise;
  //       setIsRendering(false);
  //     }
  //   };

  //   renderPage(pageNum);
  // }, [pdf, pageNum]);

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: WebViewerInstance | null = null;
    const initialize = async () => {
      if (isInitialized) return;

      isInitialized = true;
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
    <div className="mx-auto w-full min-w-0 flex-auto pt-32 sm:pt-28">
      <div
        ref={viewerRef}
        className="min-h-[87vh] w-full [&_iframe]:min-h-[87vh]"
      />

      {/* <canvas ref={canvasRef} style={{ border: "1px solid #000" }} /> */}

      {/* <iframe
        src={`/pdfjs-web/viewer.html?file=${encodeURIComponent(pdfSource.finalUrl!)}`}
        className="min-h-[87vh] w-full border-none"
      /> */}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const PdfViewClient = dynamic(() => import("./index"), {
  ssr: false,
});

export default PdfViewClient;

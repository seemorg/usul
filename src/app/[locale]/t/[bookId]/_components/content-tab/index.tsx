/* eslint-disable react/jsx-key */
"use client";

import { Separator } from "@/components/ui/separator";
import SidebarContainer from "../sidebar/sidebar-container";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import { useSearchParams } from "next/navigation";
import PdfChaptersList from "./pdf-chapters-section";

export default function ContentTab({ bookResponse }: TabProps) {
  const { pagesRange, getVirtuosoIndex } = usePageNavigation(bookResponse);

  const view = (useSearchParams().get("view") ?? "default") as
    | "pdf"
    | "default";

  const bookContent = bookResponse.content;

  const isExternal = bookContent.source === "external";

  const headings = !isExternal ? bookContent.headings : [];

  const chapterIndexToPageIndex =
    bookContent.source === "turath"
      ? bookContent.chapterIndexToPageIndex
      : null;

  return (
    <>
      {isExternal ? null : view === "pdf" ? (
        <>
          <Separator className="my-4" />
          <PdfChaptersList />
        </>
      ) : (
        <>
          <Separator className="my-4" />

          {headings && headings.length > 0 ? (
            <SidebarContainer>
              <div className="w-full">
                <PageNavigator
                  range={pagesRange}
                  getVirtuosoIndex={getVirtuosoIndex}
                />
              </div>
            </SidebarContainer>
          ) : null}

          <ChaptersList
            headers={headings || []}
            getVirtuosoIndex={getVirtuosoIndex}
            chapterIndexToPageIndex={chapterIndexToPageIndex}
            pagesRange={pagesRange}
          />
        </>
      )}

      <div className="h-16" />
    </>
  );
}

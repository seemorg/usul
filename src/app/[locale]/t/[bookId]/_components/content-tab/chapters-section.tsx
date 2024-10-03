"use client";

import { useReaderVirtuoso } from "../context";
import PageNavigator from "./page-navigator";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import React, { useMemo } from "react";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import type { Openiti, Turath } from "@/types/ApiBookResponse";
import { type TreeDataItem, TreeView } from "@/components/tree-view";

type OpenitiChapter = NonNullable<Openiti["headings"]>[number];
type TurathChapter = NonNullable<Turath["headings"]>[number];

type BookDataItem = TreeDataItem & { level: number; volume?: number | string };

function prepareChapter(
  chapter: OpenitiChapter | TurathChapter,
  idx: number,
): BookDataItem {
  const isTurath = !(typeof chapter.page === "number");

  return {
    id: idx.toString(),
    name: chapter.title,
    page: isTurath
      ? (chapter.page as TurathChapter["page"])?.page
      : (chapter as OpenitiChapter).page,
    volume: isTurath
      ? (chapter.page as TurathChapter["page"])?.vol
      : (chapter as OpenitiChapter).volume,
    level: chapter.level,
  };
}

// Function to build hierarchy
function buildHierarchy(
  chapters: (OpenitiChapter | TurathChapter)[],
): TreeDataItem[] {
  const result: BookDataItem[] = [];
  const stack: BookDataItem[] = [];

  chapters.forEach((chapter, idx) => {
    const preparedChapter = prepareChapter(chapter, idx);

    while (
      stack.length > 0 &&
      stack[stack.length - 1]!.level >= preparedChapter.level
    ) {
      stack.pop(); // Pop the stack until we find the correct parent
    }

    if (stack.length === 0) {
      // No parent, this is a root level item
      result.push(preparedChapter);
    } else {
      // There is a parent, append to its children
      const parent = stack[stack.length - 1]!;
      parent.children = parent.children || [];
      parent.children.push(preparedChapter);
    }

    // Push the current chapter onto the stack to process future nested levels
    stack.push(preparedChapter);
  });

  return result;
}

export default function ChaptersList({
  headers,
  chapterIndexToPageIndex,
  getVirtuosoIndex,
  pagesRange,
}: {
  headers: NonNullable<Openiti["headings"] | Turath["headings"]>;
  chapterIndexToPageIndex?: Turath["chapterIndexToPageIndex"] | null;
  pagesRange: UsePageNavigationReturnType["pagesRange"];
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
}) {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();

  const finalHeaders = useMemo(() => {
    if (!headers) return [];
    return buildHierarchy(headers);
  }, [headers]);

  const handleNavigate = (
    chapterIndex: number,
    pageNumber: number | { vol: string; page: number } | string,
  ) => {
    if (typeof pageNumber === "string") return;

    const idx = chapterIndexToPageIndex?.[chapterIndex] ?? -1;
    if (idx !== -1) {
      virtuosoRef.current?.scrollToIndex(idx);
    } else {
      const props = getVirtuosoIndex(pageNumber);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    }

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  if (headers.length === 0) {
    return (
      <div className="mt-5">
        <PageNavigator
          popover={false}
          range={pagesRange}
          getVirtuosoIndex={getVirtuosoIndex}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="mt-3 px-6">
      <TreeView
        dir="rtl"
        onSelectChange={(item) => {
          if (!item || !item.page) return;

          handleNavigate(parseInt(item.id), item.page);
        }}
        data={finalHeaders}
      />
    </div>
  );
}

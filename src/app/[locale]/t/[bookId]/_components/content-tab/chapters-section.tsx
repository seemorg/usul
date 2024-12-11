import { useReaderVirtuoso } from "../context";
import PageNavigator from "./page-navigator";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import React, { useMemo } from "react";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { TurathContent } from "@/types/api/content/turath";

import { type TreeDataItem, TreeView } from "@/components/tree-view";
import { useRouter } from "@/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { navigation } from "@/lib/urls";

type OpenitiChapter = NonNullable<OpenitiContent["headings"]>[number];
type TurathChapter = NonNullable<TurathContent["headings"]>[number];

type BookDataItem = TreeDataItem & {
  level: number;
  volume?: number | string;
  pageIndex?: number;
};

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
    pageIndex: chapter.pageIndex,
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
  pagesRange,
  getVirtuosoScrollProps,
  isSinglePage,
}: {
  headers: NonNullable<OpenitiContent["headings"] | TurathContent["headings"]>;
  pagesRange: UsePageNavigationReturnType["pagesRange"];
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
  isSinglePage?: boolean;
}) {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();
  const bookSlug = useParams().bookId as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const finalHeaders = useMemo(() => {
    if (!headers) return [];
    return buildHierarchy(headers);
  }, [headers]);

  const handleNavigate = (chapterIndex: number) => {
    const chapter = headers[chapterIndex];
    const idx = chapter?.pageIndex;

    if (idx !== undefined && idx !== -1) {
      if (isSinglePage) {
        router.push(
          `${navigation.books.pageReader(bookSlug, idx + 1)}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
        );
      } else {
        const props = getVirtuosoScrollProps(idx);
        virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
      }
    }

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  if (headers.length === 0) {
    return (
      <div className="mt-5 px-6">
        <PageNavigator
          popover={false}
          range={pagesRange}
          getVirtuosoScrollProps={getVirtuosoScrollProps}
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

          handleNavigate(parseInt(item.id));
        }}
        data={finalHeaders}
      />
    </div>
  );
}

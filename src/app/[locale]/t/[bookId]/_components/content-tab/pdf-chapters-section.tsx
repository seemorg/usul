import { useMemo } from "react";
import { usePdfChapterStore } from "../pdf-view/store";
import type { PdfChapter } from "../pdf-view/store";
import { TreeView } from "@/components/tree-view";
import type { TreeDataItem } from "@/components/tree-view";

const prepareChapter = (
  chapter: PdfChapter,
  level: number,
  levelLimit: number,
): TreeDataItem => {
  const id = chapter.id.toString();

  return {
    id,
    name: chapter.title,
    ...(chapter.page ? { page: chapter.page } : {}),
    ...(chapter.children && chapter.children.length > 0 && level < levelLimit
      ? {
          children: chapter.children.map((child) =>
            prepareChapter(child, level + 1, levelLimit),
          ),
        }
      : {}),
  };
};

function PdfChaptersList() {
  const chapters = usePdfChapterStore((s) => s.chapters);
  const navigateToPage = usePdfChapterStore((s) => s.navigateToPage);

  const preparedChapters = useMemo(() => {
    return chapters.map((chapter) => prepareChapter(chapter, 0, 5));
  }, [chapters]);

  if (!preparedChapters || preparedChapters.length === 0) return null;

  return (
    <div dir="rtl" className="px-6">
      <TreeView
        dir="rtl"
        onSelectChange={(item) => {
          if (!item || !item.page) return;

          // navigate when it's a chapter
          navigateToPage(item.page);
        }}
        data={
          (preparedChapters.length === 1
            ? preparedChapters[0]!.children
            : preparedChapters) as any
        }
      />
    </div>
  );
}

export default PdfChaptersList;

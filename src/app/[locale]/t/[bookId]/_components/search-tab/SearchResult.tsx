import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useReaderVirtuoso } from "../context";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import { removeDiacritics } from "@/lib/diacritics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import type { UsePageNavigationReturnType } from "../usePageNavigation";

const SearchResult = ({
  result,
  getVirtuosoIndex,
}: {
  result: SemanticSearchBookNode;
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
}) => {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();
  const t = useTranslations();

  const page = result.metadata.pages[0];

  const handleNavigate = () => {
    if (!page || page.page === -1) return;

    const props = getVirtuosoIndex(page.page);
    virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  const content = removeDiacritics(result.text).split(" ");
  // content[4] = `<span class="text-primary font-bold">${content[4]}</span>`;
  // content[5] = `<span class="text-primary font-bold">${content[5]}</span>`;
  // content[6] = `<span class="text-primary font-bold">${content[6]}</span>`;

  return (
    <div
      className="border-t border-border px-8 pb-6 pt-3 transition-colors hover:cursor-pointer hover:bg-gray-100"
      onClick={handleNavigate}
    >
      <div className="flex items-center justify-between text-xs text-gray-500">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="btn z-10 hover:bg-gray-200 data-[state=open]:bg-gray-200"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Bookmark</DropdownMenuItem>
            <DropdownMenuItem>Navigate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <p>{result.metadata.chapters.at(-1)}</p>
        </div>
      </div>

      <p
        dir="rtl"
        className="mt-2 font-amiri text-lg [&>em]:font-bold [&>em]:not-italic [&>em]:text-primary"
        dangerouslySetInnerHTML={{
          __html: content.join(" "),
        }}
      />

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <p> {t("common.pagination.page-x", { page: page ? page.page : -1 })}</p>
        {result.score ? <span>{(result.score * 100).toFixed(0)}%</span> : null}
      </div>
    </div>
  );
};

export default SearchResult;

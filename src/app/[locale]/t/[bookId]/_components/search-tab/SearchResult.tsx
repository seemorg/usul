import type { OpenitiContent } from "@/types/api/content/openiti";
import type { TurathContent } from "@/types/api/content/turath";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeDiacritics } from "@/lib/diacritics";
import { useBookShareUrl } from "@/lib/share";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useMobileReaderStore } from "@/stores/mobile-reader";
import { ShareIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { UsePageNavigationReturnType } from "../usePageNavigation";
import { useReaderVirtuoso } from "../context";

const SearchResult = ({
  result,
  getVirtuosoScrollProps,
  headings,
}: {
  result: SemanticSearchBookNode;
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
  headings: OpenitiContent["headings"] | TurathContent["headings"];
}) => {
  const virtuosoRef = useReaderVirtuoso();
  const closeMobileSidebar = useMobileReaderStore((s) => s.closeMobileSidebar);
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const slug = params.bookId as string;
  const isSinglePage = !!(params.pageNumber as string | undefined);

  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");

  const { copyUrl: copySearchResultUrl } = useBookShareUrl();

  const page = result.metadata.pages[0];

  const handleNavigate = () => {
    if (!page || page.page === -1) return;

    const index = page.index;

    if (isSinglePage) {
      router.push(
        `${navigation.books.pageReader(slug, index + 1)}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
      );
    } else {
      const props = getVirtuosoScrollProps(index);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    }

    closeMobileSidebar();
  };

  const handleShare = async () => {
    if (!page || page.page === -1) return;

    const idx = page.index;

    await copySearchResultUrl({
      slug,
      pageIndex: idx,
      versionId: versionId ?? undefined,
    });
  };

  const content =
    result.highlights && result.highlights.length > 0
      ? result.highlights.join("<br>...<br>")
      : removeDiacritics(result.text);

  const chapter = result.metadata.chapters.at(-1);
  // const volume =
  //   page && (("volume" in page ? page.volume : page.vol) as string | undefined);

  return (
    <div
      className="border-border hover:bg-accent/50 border-b px-6 py-4 transition-colors hover:cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent focus:bg-accent size-9"
            onClick={(e) => {
              e.stopPropagation(); // don't trigger navigate
              void handleShare();
            }}
          >
            <ShareIcon className="size-4" />
          </Button>
        </div>

        {chapter && (
          <div className="flex max-w-[80%] gap-2" dir="rtl">
            <p>
              {typeof chapter === "number"
                ? headings?.[chapter]?.title
                : chapter}
            </p>
          </div>
        )}
      </div>

      <p
        dir="rtl"
        className="font-scheherazade [&>em]:text-primary mt-4 text-lg [&>em]:font-bold [&>em]:not-italic"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
        {result.score ? (
          <span>
            {t("reader.match-rate-x", {
              matchRate: Math.floor(result.score * 100),
            })}
          </span>
        ) : (
          <span />
        )}

        <p>{t("common.pagination.page-x", { page: page ? page.page : -1 })}</p>
      </div>
    </div>
  );
};

export default SearchResult;

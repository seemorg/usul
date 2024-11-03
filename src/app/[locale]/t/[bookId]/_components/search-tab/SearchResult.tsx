import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useReaderVirtuoso } from "../context";
import { useMobileSidebar } from "../mobile-sidebar-provider";
import { removeDiacritics } from "@/lib/diacritics";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import { useMutation } from "@tanstack/react-query";
import { getBookPageIndex } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import { ShareIcon } from "lucide-react";
import { useBookShareUrl } from "@/lib/share";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "@/navigation";
import { navigation } from "@/lib/urls";

const SearchResult = ({
  result,
  getVirtuosoScrollProps,
}: {
  result: SemanticSearchBookNode;
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
}) => {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const slug = params.bookId as string;
  const isSinglePage = !!(params.pageNumber as string | undefined);

  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");

  const { copyUrl: copySearchResultUrl } = useBookShareUrl();

  const { isPending, mutateAsync, data } = useMutation({
    mutationKey: ["page"],
    mutationFn: (args: { page: number; vol?: string }) => {
      return getBookPageIndex(slug, {
        page: args.page,
        volume: args.vol,
        versionId: versionId ?? undefined,
      });
    },
  });

  const page = result.metadata.pages[0];

  const handleNavigate = async () => {
    if (!page || page.page === -1 || isPending) return;

    const result = await mutateAsync({ page: page.page, vol: page.vol });

    if (result.index === null) return;

    if (isSinglePage) {
      router.push(
        `${navigation.books.pageReader(slug, result.index + 1)}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
      );
    } else {
      const props = getVirtuosoScrollProps(result.index);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    }

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  const handleShare = async () => {
    if (!page || page.page === -1 || isPending) return;

    let idx: number;
    if (data) {
      if (data.index === null) return;
      idx = data.index;
    } else {
      const result = await mutateAsync({ page: page.page, vol: page.vol });
      if (result.index === null) return;
      idx = result.index;
    }

    await copySearchResultUrl({
      slug,
      pageIndex: idx,
      versionId: versionId ?? undefined,
    });
  };

  const content = removeDiacritics(result.text);

  return (
    <div
      className="border-b border-border px-6 py-4 transition-colors hover:cursor-pointer hover:bg-accent/50"
      onClick={handleNavigate}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 hover:bg-accent focus:bg-accent"
            onClick={(e) => {
              e.stopPropagation(); // don't trigger navigate
              handleShare();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              <ShareIcon className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <p>{result.metadata.chapters.at(-1)}</p>
        </div>
      </div>

      <p
        dir="rtl"
        className="mt-4 font-scheherazade text-lg [&>em]:font-bold [&>em]:not-italic [&>em]:text-primary"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        {result.score ? (
          <span>
            {t("reader.match-rate-x", {
              matchRate: Math.floor(result.score * 100),
            })}
          </span>
        ) : null}
        <p> {t("common.pagination.page-x", { page: page ? page.page : -1 })}</p>
      </div>
    </div>
  );
};

export default SearchResult;

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
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { TurathContent } from "@/types/api/content/turath";

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
    mutationFn: async (args: { page: number; vol?: string }) => {
      const result = await getBookPageIndex(slug, {
        page: args.page,
        volume: args.vol,
        versionId: versionId ?? undefined,
      });

      if (!result || "type" in result) {
        return null;
      }

      return result;
    },
  });

  const page = result.metadata.pages[0];

  const handleNavigate = async () => {
    if (!page || page.page === -1 || isPending) return;

    let index: number;
    if ("index" in page) {
      index = page.index as number;
    } else {
      const result = await mutateAsync({ page: page.page, vol: page.vol });
      if (!result || result.index === null) return;
      index = result.index;
    }

    if (isSinglePage) {
      router.push(
        `${navigation.books.pageReader(slug, index + 1)}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
      );
    } else {
      const props = getVirtuosoScrollProps(index);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    }

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  const handleShare = async () => {
    if (!page || page.page === -1 || isPending) return;

    let idx: number;

    if ("index" in page) {
      idx = page.index as number;
    } else if (data) {
      if (data.index === null) return;
      idx = data.index;
    } else {
      const result = await mutateAsync({ page: page.page, vol: page.vol });
      if (!result || result.index === null) return;
      idx = result.index;
    }

    await copySearchResultUrl({
      slug,
      pageIndex: idx,
      versionId: versionId ?? undefined,
    });
  };

  const content = result.highlights
    ? result.highlights.join("<br>...<br>")
    : removeDiacritics(result.text);

  const chapter = result.metadata.chapters.at(-1);
  // const volume =
  //   page && (("volume" in page ? page.volume : page.vol) as string | undefined);

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
        ) : (
          <span />
        )}

        <p>{t("common.pagination.page-x", { page: page ? page.page : -1 })}</p>
      </div>
    </div>
  );
};

export default SearchResult;

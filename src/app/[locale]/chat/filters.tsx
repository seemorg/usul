import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { useTranslations } from "next-intl";

import AuthorsFilter from "./filters/authors-filter";
import GenresFilter from "./filters/genres-filter";
import TextsFilter from "./filters/texts-filter";

export default function ChatFilters() {
  const open = useChatFilters((s) => s.open);
  const clear = useChatFilters((s) => s.clear);
  const t = useTranslations();

  return (
    <div
      className={cn(
        "transition-[height,opacity] will-change-[transform,opacity,height]",
        open ? "h-auto" : "pointer-events-none h-0 opacity-0",
      )}
    >
      <div
        className={cn(
          "border-border mx-auto flex w-full items-center justify-between gap-4 border-b px-4 py-4 md:max-w-3xl ltr:pl-12 sm:ltr:pl-4 rtl:pr-12 sm:rtl:pr-4",
        )}
      >
        <div className="flex gap-2">
          <TextsFilter />
          <AuthorsFilter />
          <GenresFilter />
        </div>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-accent text-sm"
          onClick={clear}
        >
          {t("common.clear-filters")}
        </Button>
      </div>
    </div>
  );
}

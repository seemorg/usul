"use client";

import type { AuthorDocument } from "@/types/author";
import type { GenreDocument } from "@/types/genre";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useChatFilters } from "@/stores/chat-filters";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function EntityActions({
  type,
  entity,
}:
  | {
      type: "genre";
      entity: GenreDocument;
    }
  | {
      type: "author";
      entity: AuthorDocument;
    }) {
  const t = useTranslations();
  const router = useRouter();
  const clearFilters = useChatFilters((s) => s.clear);
  const addAuthor = useChatFilters((s) => s.addAuthor);
  const addGenre = useChatFilters((s) => s.addGenre);
  const setOpen = useChatFilters((s) => s.setOpen);

  const handleChat = () => {
    clearFilters(); // clear filters
    setOpen(true); // open filters

    if (type === "author") {
      addAuthor(entity);
    } else {
      addGenre(entity);
    }

    router.push(navigation.chat.all());
  };

  return (
    <div className="mt-5 flex gap-3">
      <Button variant="outline" className="rounded-full" onClick={handleChat}>
        <SparklesIcon className="size-4" />
        {t("chat.input.ai_chat")}
      </Button>
      <Button variant="outline" className="rounded-full">
        <SearchIcon className="size-4" />
        {t("chat.input.search")}
      </Button>
    </div>
  );
}

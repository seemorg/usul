import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormatRelativeDate } from "@/lib/relative-date";
import {
  HistoryIcon,
  MoreHorizontalIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { HistoryItem } from "../../_stores/chat";
import { useChatStore } from "../../_stores/chat";

interface GroupedHistory {
  [key: string]: HistoryItem[];
}

interface ChatHistoryProps {
  onOpenChange: (open: boolean) => void;
  bookId: string;
  versionId: string;
}

export function ChatHistory({
  onOpenChange,
  bookId,
  versionId,
}: ChatHistoryProps) {
  const t = useTranslations("reader");
  const formatter = useFormatRelativeDate();

  const history = useChatStore((state) => state.history);
  const revertToHistoryChat = useChatStore(
    (state) => state.revertToHistoryChat,
  );
  const deleteHistoryChat = useChatStore((state) => state.deleteHistoryChat);

  const groupedHistory = useMemo(() => {
    const arrayHistory = Object.values(history);

    return arrayHistory.reduce((groups, item) => {
      if (
        item.bookId !== bookId ||
        (item.versionId && item.versionId !== versionId)
      )
        return groups;

      const date = item.date instanceof Date ? item.date : new Date(item.date);

      const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (!groups[day]) groups[day] = [];
      groups[day]!.push(item);
      return groups;
    }, {} as GroupedHistory);
  }, [history]);

  const onSelectHistory = (chatId: string) => {
    revertToHistoryChat(chatId);
    onOpenChange(false);
  };

  const entries = Object.entries(groupedHistory);

  return (
    <div className="h-full w-full px-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{t("history.title")}</p>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-secondary size-9"
          onClick={() => onOpenChange(false)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {entries.length > 0 ? (
          entries.map(([day, items]) => (
            <div key={day}>
              <h3 className="text-muted-foreground text-sm font-medium capitalize">
                {formatter(new Date(day))}
              </h3>

              <div className="mt-2 flex flex-col gap-1">
                {items.map((item) => (
                  <div
                    key={item.chatId}
                    role="button"
                    className="hover:bg-secondary/60 flex h-10 w-full items-center justify-between rounded-md px-4 py-2 text-sm transition-colors"
                    onClick={() => onSelectHistory(item.chatId)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectHistory(item.chatId);
                      }
                    }}
                    title={item.messages[0]?.text ?? "No question"}
                  >
                    <span className="line-clamp-1">
                      {item.messages[0]?.text ?? "No question"}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-secondary"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when clicking dropdown
                          }}
                          onKeyDown={(e) => {
                            e.stopPropagation(); // Prevent card action when opening dropdown with keyboard
                          }}
                        >
                          <MoreHorizontalIcon className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-40"
                        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking menu items
                        onKeyDown={(e) => e.stopPropagation()} // Prevent card action when navigating menu with keyboard
                      >
                        <DropdownMenuItem
                          onClick={() => deleteHistoryChat(item.chatId)}
                          className="gap-2"
                        >
                          <TrashIcon className="size-4" />
                          {t("history.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto flex h-[50vh] max-w-[350px] flex-col items-center justify-center px-8 text-center md:h-[65vh]">
            <HistoryIcon className="size-7" />
            <p className="mt-4 text-center text-lg">
              {t("history.empty-state")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

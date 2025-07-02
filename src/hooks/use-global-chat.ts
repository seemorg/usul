import { useChatFilters } from "@/app/[locale]/chat/chat-filters";
import { env } from "@/env";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";

export function useGlobalChat() {
  const selectedBooks = useChatFilters((s) => s.selectedBooks);
  return useChat({
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/multi`,
    body: {
      bookIds: selectedBooks.map((book) => book.id),
    },
    experimental_throttle: 100,
    onError: () => {
      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
      toast.error(
        isOffline
          ? "You are offline. Please check your internet connection."
          : "An error occurred!",
      );
    },
  });
}

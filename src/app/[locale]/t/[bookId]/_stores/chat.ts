import type { UIMessage } from "ai";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryItem = {
  chatId: string;
  bookId: string;
  versionId: string;
  messages: UIMessage[];
  date: Date;
};

interface ChatStore {
  currentChatId: string | null;
  currentBookId: string | null;
  currentVersionId: string | null;

  // id -> history item
  history: Record<string, HistoryItem>;
  syncHistory: (messages: UIMessage[]) => void;
  revertToHistoryChat: (chatId: string) => void;
  clearChat: () => void;
  deleteHistoryChat: (chatId: string) => void;

  initializeChat: ({
    bookId,
    versionId,
  }: {
    bookId: string;
    versionId: string;
  }) => void;
}

export const useChatStore = create(
  persist<ChatStore>(
    (set, get) => ({
      history: {},
      currentChatId: null,
      currentBookId: null,
      currentVersionId: null,
      syncHistory: (messages: UIMessage[]) => {
        const state = get();

        if (state.currentChatId && messages.length > 0) {
          const historyItem = state.history[state.currentChatId];

          const updatedHistoryItem: HistoryItem = {
            ...(historyItem ?? {
              chatId: state.currentChatId,
              bookId: state.currentBookId!,
              versionId: state.currentVersionId!,
              date: new Date(),
            }),
            messages,
          };

          set({
            history: {
              ...state.history,
              [state.currentChatId]: updatedHistoryItem,
            },
          });
        }
      },
      revertToHistoryChat: (chatId: string) => {
        set({ currentChatId: chatId });
      },
      clearChat: () => {
        set({ currentChatId: nanoid() });
      },
      deleteHistoryChat: (chatId: string) => {
        const state = get();
        const { [chatId]: _, ...history } = state.history;
        set({ history });
      },

      initializeChat: ({
        bookId,
        versionId,
      }: {
        bookId: string;
        versionId: string;
      }) => {
        const newChatId = nanoid();

        set({
          currentChatId: newChatId,
          currentBookId: bookId,
          currentVersionId: versionId,
        });
      },
    }),
    {
      name: "ai-chat-history",
      partialize: (state) => ({ history: state.history }) as ChatStore,
      version: 1,
      migrate: () => {
        return {
          history: {},
          currentChatId: null,
          currentBookId: null,
          currentVersionId: null,
          syncHistory: () => {},
          revertToHistoryChat: () => {},
          deleteHistoryChat: () => {},
          initializeChat: () => {},
          clearChat: () => {},
        };
      },
    },
  ),
);

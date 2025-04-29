import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  id?: string;
  text: string;
  role: "ai" | "user";
  sourceNodes?: SemanticSearchBookNode[];
};

export type HistoryItem = {
  chatId: string;
  bookId: string;
  versionId: string;
  messages: ChatMessage[];
  date: Date;
};

interface ChatStore {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;

  question: string;
  setQuestion: (question: string) => void;

  isPending: boolean;
  setIsPending: (isPending: boolean) => void;

  error?: Error;
  setError: (error?: Error) => void;

  currentChatId: string | null;
  currentBookId: string | null;
  currentVersionId: string | null;

  // id -> history item
  history: Record<string, HistoryItem>;
  syncHistory: () => void;
  revertToHistoryChat: (chatId: string) => void;
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
      messages: [],
      history: {},

      currentChatId: null,
      currentBookId: null,
      currentVersionId: null,

      setMessages: (messages: ChatMessage[]) => set({ messages }),

      syncHistory: () => {
        const state = get();

        if (state.currentChatId && state.messages.length > 0) {
          const historyItem = state.history[state.currentChatId];

          const updatedHistoryItem: HistoryItem = {
            ...(historyItem ?? {
              chatId: state.currentChatId,
              bookId: state.currentBookId!,
              versionId: state.currentVersionId!,
              date: new Date(),
            }),
            messages: state.messages,
          };

          set({
            history: {
              ...state.history,
              [state.currentChatId]: updatedHistoryItem,
            },
          });
        }
      },

      question: "",
      setQuestion: (question: string) => set({ question }),

      isPending: false,
      setIsPending: (isPending: boolean) => set({ isPending }),

      error: undefined,
      setError: (error?: Error) => set({ error }),

      revertToHistoryChat: (chatId: string) => {
        const state = get();
        const historyItem = state.history[chatId];
        if (!historyItem) return;

        set({
          messages: historyItem.messages,
          currentChatId: historyItem.chatId,
          currentBookId: historyItem.bookId,
          currentVersionId: historyItem.versionId,
          question: "",
          isPending: false,
          error: undefined,
        });
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
          messages: [],
          question: "",
          isPending: false,
          error: undefined,
        });
      },
    }),
    {
      name: "ai-chat-history",
      partialize: (state) => ({ history: state.history }) as ChatStore,
      version: 0,
    },
  ),
);

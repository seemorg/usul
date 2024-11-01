import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { create } from "zustand";

export type ChatMessage = {
  id?: string;
  text: string;
  role: "ai" | "user";
  sourceNodes?: SemanticSearchBookNode[];
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

  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages: ChatMessage[]) => set({ messages }),

  question: "",
  setQuestion: (question: string) => set({ question }),

  isPending: false,
  setIsPending: (isPending: boolean) => set({ isPending }),
  error: undefined,
  setError: (error?: Error) => set({ error }),

  reset: () =>
    set({
      messages: [],
      question: "",
      isPending: false,
      error: undefined,
    }),
}));

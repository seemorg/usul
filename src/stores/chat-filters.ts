import type { AuthorDocument } from "@/types/author";
import type { BookDocument } from "@/types/book";
import type { GenreDocument } from "@/types/genre";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatFiltersState {
  open: boolean;
  setOpen: (open: boolean) => void;

  selectedBooks: BookDocument[];
  addBook: (book: BookDocument) => void;
  removeBook: (bookId: string) => void;

  selectedAuthors: AuthorDocument[];
  addAuthor: (author: AuthorDocument) => void;
  removeAuthor: (authorId: string) => void;

  selectedGenres: GenreDocument[];
  addGenre: (genre: GenreDocument) => void;
  removeGenre: (genreId: string) => void;

  clear: () => void;
}

export const useChatFilters = create(
  persist<ChatFiltersState>(
    (set) => ({
      open: true,
      setOpen: (open) => set({ open }),

      selectedBooks: [],
      addBook: (book) =>
        set((state) => {
          const exists = state.selectedBooks.find((b) => b.id === book.id);
          if (exists) return state;
          return {
            selectedBooks: [...state.selectedBooks, book],
          };
        }),
      removeBook: (bookId) =>
        set((state) => ({
          selectedBooks: state.selectedBooks.filter((b) => b.id !== bookId),
        })),

      selectedAuthors: [],
      addAuthor: (author) =>
        set((state) => {
          const exists = state.selectedAuthors.find((a) => a.id === author.id);
          if (exists) return state;
          return { selectedAuthors: [...state.selectedAuthors, author] };
        }),
      removeAuthor: (authorId) =>
        set((state) => ({
          selectedAuthors: state.selectedAuthors.filter(
            (a) => a.id !== authorId,
          ),
        })),

      selectedGenres: [],
      addGenre: (genre) =>
        set((state) => {
          const exists = state.selectedGenres.find((g) => g.id === genre.id);
          if (exists) return state;
          return { selectedGenres: [...state.selectedGenres, genre] };
        }),
      removeGenre: (genreId) =>
        set((state) => ({
          selectedGenres: state.selectedGenres.filter((g) => g.id !== genreId),
        })),

      clear: () =>
        set({ selectedBooks: [], selectedAuthors: [], selectedGenres: [] }),
    }),
    {
      name: "chat-filters",
    },
  ),
);

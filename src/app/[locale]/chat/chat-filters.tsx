import type { BookDocument } from "@/types/book";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterIcon, XIcon } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import BookSearch from "../(defaultLayout)/collections/[slug]/edit/book-search";

export const useChatFilters = create(
  persist<{
    selectedBooks: BookDocument[];
    setSelectedBooks: (books: BookDocument[]) => void;
    addBook: (book: BookDocument) => void;
    removeBook: (bookId: string) => void;
  }>(
    (set) => ({
      selectedBooks: [],
      setSelectedBooks: (books) => set({ selectedBooks: books }),
      addBook: (book) =>
        set((state) => {
          const exists = state.selectedBooks.some((b) => b.id === book.id);
          if (exists) return state;
          return {
            selectedBooks: [...state.selectedBooks, book],
          };
        }),
      removeBook: (bookId) =>
        set((state) => ({
          selectedBooks: state.selectedBooks.filter((b) => b.id !== bookId),
        })),
    }),
    {
      name: "chat-filters",
    },
  ),
);

const ChatFilters = memo(() => {
  const { selectedBooks, addBook, removeBook } = useChatFilters();

  const handleBookSelect = (book: BookDocument) => {
    addBook(book);
  };

  return (
    <div className="absolute bottom-0 left-0 flex w-fit flex-row justify-end gap-2 px-5 py-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            size="sm"
            type="button"
          >
            <FilterIcon className="size-3" />
            Filters
            {selectedBooks.length > 0 && (
              <Badge
                variant="secondary"
                className="size-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {selectedBooks.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Books</label>
              <p className="text-muted-foreground mb-2 text-xs">
                Select books to filter chat responses
              </p>
              <BookSearch
                onBookSelect={handleBookSelect}
                excludeBookIds={selectedBooks.map((book) => book.id)}
                placeholder="Search books to add..."
              />
            </div>

            {selectedBooks.length > 0 && (
              <div>
                <label className="text-sm font-medium">Selected Books</label>
                <div className="mt-2 space-y-2">
                  {selectedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {book.transliteration || book.primaryName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {book.author.transliteration ||
                            book.author.primaryName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBook(book.id)}
                        className="ml-2 h-6 w-6 p-0"
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ChatFilters;

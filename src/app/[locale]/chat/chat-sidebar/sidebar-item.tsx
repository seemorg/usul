import type { RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { CheckIcon, XIcon } from "lucide-react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

import type { Chat } from "../db";
import { db } from "../db";
import { SidebarItemMenu } from "./sidebar-item-menu";

type SidebarItemProps = {
  chat: Chat;
};

export function SidebarItem({ chat }: SidebarItemProps) {
  const { chatId } = useParams<{ chatId: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastChatTitleRef = useRef(chat.title);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isEditing && lastChatTitleRef.current !== chat.title) {
    lastChatTitleRef.current = chat.title;
    setEditTitle(chat.title || "");
  }

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    setEditTitle(chat.title || "");

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
  }, [chat.title]);

  const handleSave = useCallback(async () => {
    setIsEditing(false);
    setIsMenuOpen(false);
    await db.chats.update(chat.id, {
      title: editTitle,
      updatedAt: new Date(),
    });
  }, [chat.id, editTitle]);

  const handleCancel = useCallback(() => {
    setEditTitle(chat.title || "");
    setIsEditing(false);
    setIsMenuOpen(false);
  }, [chat.title]);

  const handleMenuOpenChange = useCallback((open: boolean) => {
    setIsMenuOpen(open);
  }, []);

  const handleClickOutside = useCallback(() => {
    if (isEditing) {
      void handleSave();
    }
  }, [isEditing, handleSave]);

  useOnClickOutside(containerRef as RefObject<HTMLElement>, handleClickOutside);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) {
        e.stopPropagation();
      }
    },
    [isEditing],
  );

  const handleSaveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void handleSave();
    },
    [handleSave],
  );

  const handleCancelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCancel();
    },
    [handleCancel],
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const isActive = chat.id === chatId || isEditing || isMenuOpen;
  const displayTitle = chat.title || "Untitled Chat";

  return (
    <div
      className={cn(
        "hover:bg-accent/80 hover:text-foreground group/chat relative w-full rounded-3xl transition-colors",
        isActive && "bg-accent hover:bg-accent text-foreground",
      )}
      onClick={handleContainerClick}
      ref={containerRef}
    >
      {isEditing ? (
        <div className="bg-accent flex items-center rounded-md py-1 pr-1 pl-2">
          <input
            ref={inputRef}
            value={editTitle}
            onChange={handleInputChange}
            className="text-foreground max-h-full w-full bg-transparent text-sm focus:outline-none"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex gap-0.5">
            <button
              onClick={handleSaveClick}
              className="hover:bg-secondary text-muted-foreground hover:text-primary flex size-7 items-center justify-center rounded-md p-1 transition-colors duration-150"
              type="button"
            >
              <CheckIcon className="size-4" />
            </button>
            <button
              onClick={handleCancelClick}
              className="hover:bg-secondary text-muted-foreground hover:text-primary flex size-7 items-center justify-center rounded-md p-1 transition-colors duration-150"
              type="button"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link
            href={navigation.chat.byId(chat.id)}
            className="block w-full"
            prefetch
            onClick={handleLinkClick}
          >
            <div
              className="text-foreground relative line-clamp-1 mask-r-from-80% mask-r-to-85% px-4 py-2 text-ellipsis whitespace-nowrap"
              title={displayTitle}
            >
              {displayTitle}
            </div>
          </Link>

          <div
            className={cn(
              "absolute top-0 right-1 flex h-full items-center justify-center opacity-0 transition-opacity group-hover/chat:opacity-100",
              isMobile && "opacity-100 group-hover/chat:opacity-100",
            )}
            key={chat.id}
          >
            <SidebarItemMenu
              chat={chat}
              onStartEditing={handleStartEditing}
              onMenuOpenChange={handleMenuOpenChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

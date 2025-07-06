import { useMemo, useState } from "react";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigation } from "@/lib/urls";
import { usePathname, useRouter } from "@/navigation";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import type { Chat } from "../db";
import { db } from "../db";

type SidebarItemMenuProps = {
  chat: Chat;
  onStartEditing: () => void;
  onMenuOpenChange?: (open: boolean) => void;
};

export function SidebarItemMenu({
  chat,
  onStartEditing,
  onMenuOpenChange,
}: SidebarItemMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();
  const chatId = useMemo(() => {
    if (pathname.startsWith(`${navigation.chat.all()}/`)) {
      return pathname.split("/").pop() ?? null;
    }
    return null;
  }, [pathname]);

  const handleConfirmDelete = async () => {
    await db.chats.delete(chat.id);
    if (chatId && chatId === chat.id) {
      router.push(navigation.chat.all());
    }
  };

  return (
    <>
      <DropdownMenu
        // shadcn/ui / radix pointer-events-none issue
        modal={isMobile ? true : false}
        onOpenChange={onMenuOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <button
            className="hover:bg-secondary flex size-7 items-center justify-center rounded-md p-1 transition-colors duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVerticalIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartEditing();
            }}
          >
            <PencilIcon className="size-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

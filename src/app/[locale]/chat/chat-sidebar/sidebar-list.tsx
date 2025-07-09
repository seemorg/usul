import { useFormatRelativeDate } from "@/lib/relative-date";

import type { Chat } from "../db";
import { SidebarItem } from "./sidebar-item";

type SidebarListProps = {
  date: string;
  items: Chat[];
};

export function SidebarList({ date, items }: SidebarListProps) {
  const formatter = useFormatRelativeDate();

  return (
    <div>
      <h3 className="overflow-hidden px-2 pt-3 pb-2 text-xs font-semibold break-all text-ellipsis capitalize">
        {formatter(new Date(date))}
      </h3>

      <div className="space-y-0.5">
        {items.map((chat) => (
          <SidebarItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
}

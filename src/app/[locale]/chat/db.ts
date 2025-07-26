import type { Message } from "ai";
import type { EntityTable } from "dexie";
import Dexie from "dexie";

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const db = new Dexie("usul-chat") as Dexie & {
  chats: EntityTable<Chat, "id">;
};

db.version(1).stores({
  chats: "id",
});

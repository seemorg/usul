import type { Message } from "ai";
import type { EntityTable } from "dexie";
import Dexie from "dexie";

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const db = new Dexie("usul-chat") as Dexie & {
  chats: EntityTable<Chat, "id">;
};

db.version(1).stores({
  chats: "id",
});

export type { Chat };
export { db };

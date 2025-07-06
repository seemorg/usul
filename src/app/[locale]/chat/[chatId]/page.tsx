"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import Chat from "../chat";
import { db } from "../db";

export default function ChatIdPage() {
  const { chatId } = useParams<{ chatId: string }>();

  const chat = useLiveQuery(() => db.chats.get(chatId));
  if (!chat) {
    return <div>Chat not found</div>;
  }

  // Handle redirect for invalid chatId - only redirect if we're certain the chat doesn't exist
  // and we're not in a transient state during chat creation
  // if (
  //   chatId &&
  //   !isChatsLoading &&
  //   !currentChat &&
  //   !isSubmitting &&
  //   status === "ready" &&
  //   messages.length === 0
  // ) {
  //   return redirect({ href: "/", locale });
  // }

  return <Chat chat={chat} />;
}

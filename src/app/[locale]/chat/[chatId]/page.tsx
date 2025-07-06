"use client";

import { useParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

import Chat from "../chat";
import { db } from "../db";

export default function ChatIdPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();

  const { isLoading, data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      return (await db.chats.get(chatId)) ?? null;
    },
  });

  useIsomorphicLayoutEffect(() => {
    if (!isLoading && !chat) {
      router.push(navigation.chat.all(), undefined, { showProgressBar: false });
    }
  }, [isLoading, chat]);

  const loadingState = (
    <div className="flex h-[300px] w-full items-center justify-center">
      <Spinner />
    </div>
  );

  if (isLoading || !chat) return loadingState;

  return <Chat chat={chat} />;
}

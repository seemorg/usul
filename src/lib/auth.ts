import { env } from "@/env";
import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { useSession, signIn, signOut, updateUser } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [magicLinkClient()],
  fetchOptions: {
    credentials: "include",
  },
});

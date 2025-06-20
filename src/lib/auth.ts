import { env } from "@/env";
import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { useSession, signIn, signOut, updateUser } = createAuthClient({
  baseURL:
    env.VERCEL_ENV === "production"
      ? "https://api.usul.ai"
      : "http://localhost:8080",
  plugins: [magicLinkClient()],
  fetchOptions: {
    credentials: "include",
  },
});

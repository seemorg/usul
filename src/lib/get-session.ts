import { env } from "@/env";
import { headers } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type Session = {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
};

/** Build headers to forward the incoming request's auth context to the API. */
function buildForwardedHeaders(headersList: Headers): HeadersInit {
  const forwardHeaders: Record<string, string> = {};
  const cookie = headersList.get("cookie");
  if (cookie) forwardHeaders["cookie"] = cookie;
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) forwardHeaders["x-forwarded-for"] = forwardedFor;
  const forwardedHost = headersList.get("x-forwarded-host");
  if (forwardedHost) forwardHeaders["x-forwarded-host"] = forwardedHost;
  const forwardedProto = headersList.get("x-forwarded-proto");
  if (forwardedProto) forwardHeaders["x-forwarded-proto"] = forwardedProto;
  const referer = headersList.get("referer");
  if (referer) forwardHeaders["referer"] = referer;
  return forwardHeaders;
}

export async function getSession(): Promise<Session | null> {
  const headersList = await headers();
  const forwardedHeaders = buildForwardedHeaders(headersList);

  const response = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-session`,
    {
      headers: forwardedHeaders,
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as { data?: Session } | null;
  return data?.data ?? null;
}

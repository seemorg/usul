import { env } from "@/env";

export const makeSearchRequest = async <T>(
  collection: string,
  queryParams?: Record<string, string>,
) => {
  const searchParams = new URLSearchParams(queryParams);
  const url = `${env.TYPESENSE_URL}/collections/${collection}/documents/search?${searchParams.toString()}`;

  const res = await fetch(url, {
    headers: {
      "X-TYPESENSE-API-KEY": env.TYPESENSE_API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return res.json() as Promise<T>;
};

export const makeMultiSearchRequest = async <T>(
  searches: Array<Record<string, string>>,
) => {
  const url = `${env.TYPESENSE_URL}/multi_search`;

  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      "X-TYPESENSE-API-KEY": env.TYPESENSE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searches,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return res.json() as Promise<T>;
};

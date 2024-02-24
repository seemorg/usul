import { env } from "@/env";

export const makeSearchRequest = async (
  collection: string,
  queryParams?: Record<any, any>,
) => {
  const searchParams = new URLSearchParams(queryParams);
  const url = `${env.TYPESENSE_URL}/collections/${collection}/documents/search?${searchParams.toString()}`;

  const res = await fetch(url, {
    headers: {
      "X-TYPESENSE-API-KEY": env.TYPESENSE_API_KEY,
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return res.json();
};

export const makeMultiSearchRequest = async (
  searches: Array<Record<any, any>>,
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

  return res.json();
};

import { env } from "@/env";

type Serializable = string | number | boolean;
type Params = Record<string, Serializable | Serializable[] | undefined | null>;

export const prepareSearchParams = (params?: Params) => {
  if (!params) return "";

  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            (Array.isArray(value) ? value.length > 0 : true),
        )
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : value!.toString(),
        ]),
    ),
  );

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const apiFetch = async <T>(
  url: string | { path: string; params?: Params },
  {
    body,
    ...init
  }: Omit<RequestInit, "body"> & { throw?: boolean; body?: unknown } = {},
): Promise<T | null> => {
  const path = typeof url === "string" ? url : url.path;
  const params = typeof url === "string" ? undefined : url.params;
  const finalUrl = `${env.NEXT_PUBLIC_API_BASE_URL}${path}${prepareSearchParams(params)}`;

  const response = await fetch(finalUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body as object) : undefined,
    ...init,
  });

  if (!response.ok || response.status >= 300) {
    if (init.throw) {
      throw new ApiError(
        `API error: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    return null;
  }

  return response.json() as Promise<T>;
};

export const prepareSearchParams = (params?: Record<string, string>) => {
  if (!params) return "";

  const queryParams = new URLSearchParams(params);
  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

// File: src/utils/api/helpers.ts
export const buildUrlWithParams = (baseUrl: string, params: Record<string, string | number>): string => {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.pathname + url.search;
};

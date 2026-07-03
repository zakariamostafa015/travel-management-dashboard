import type { ApiResponse, AuthTokenResponse, MediaAsset } from "@/types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");
const AUTH_KEY = "travel-tours-admin-auth";

export type StoredAuth = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
};

export class ApiError extends Error {
  status: number;
  traceId?: string | null;
  errors?: Record<string, string[]> | null;

  constructor(message: string, status: number, traceId?: string | null, errors?: Record<string, string[]> | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.traceId = traceId;
    this.errors = errors;
  }
}

export function getStoredAuth(): StoredAuth | null {
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function setStoredAuth(value: StoredAuth | AuthTokenResponse) {
  window.localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      accessToken: value.accessToken,
      accessTokenExpiresAtUtc: value.accessTokenExpiresAtUtc,
      refreshToken: value.refreshToken,
      refreshTokenExpiresAtUtc: value.refreshTokenExpiresAtUtc,
    })
  );
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_KEY);
}

function buildUrl(path: string, query?: Record<string, unknown>) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? ((await response.json()) as ApiResponse<T>) : null;

  if (!response.ok || body?.success === false) {
    throw new ApiError(
      body?.message ?? response.statusText ?? "Request failed.",
      response.status,
      body?.traceId,
      body?.errors
    );
  }

  if (body && "data" in body) return body.data as T;
  return undefined as T;
}

let refreshPromise: Promise<AuthTokenResponse> | null = null;

async function refreshToken() {
  const auth = getStoredAuth();
  if (!auth?.refreshToken) throw new ApiError("Your session has expired.", 401);

  refreshPromise ??= fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
  })
    .then(parseResponse<AuthTokenResponse>)
    .then((tokens) => {
      setStoredAuth(tokens);
      return tokens;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { query?: Record<string, unknown>; skipAuth?: boolean; retryOnUnauthorized?: boolean } = {}
): Promise<T> {
  const auth = getStoredAuth();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!options.skipAuth && auth?.accessToken) {
    headers.set("Authorization", `Bearer ${auth.accessToken}`);
  }

  try {
    return await fetch(buildUrl(path, options.query), {
      ...options,
      headers,
    }).then(parseResponse<T>);
  } catch (error) {
    const canRefresh =
      error instanceof ApiError &&
      error.status === 401 &&
      options.retryOnUnauthorized !== false &&
      !options.skipAuth &&
      Boolean(auth?.refreshToken);

    if (!canRefresh) throw error;
    await refreshToken();
    return apiRequest<T>(path, { ...options, retryOnUnauthorized: false });
  }
}

export const api = {
  get: <T>(path: string, query?: Record<string, unknown>) => apiRequest<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string, query?: Record<string, unknown>) => apiRequest<T>(path, { method: "DELETE", query }),
  uploadImage: (file: File, folderName: string, meta?: { altText?: string; caption?: string }) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folderName", folderName);
    if (meta?.altText) form.append("altText", meta.altText);
    if (meta?.caption) form.append("caption", meta.caption);
    return apiRequest<MediaAsset>("/media/images", { method: "POST", body: form });
  },
};

export function getApiBaseUrl() {
  return API_BASE_URL;
}

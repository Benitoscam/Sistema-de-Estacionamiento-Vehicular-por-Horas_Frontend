import type { ApiErr } from "../types";

const TOKEN_KEY = "parqueo_token";
const base = ((import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:5000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;
  detail?: string;

  constructor(message: string, status: number, payload?: ApiErr | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.detail = payload?.detail;
  }
}

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

interface FetchOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth !== false) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const payload = (json ?? null) as ApiErr | null;
    throw new ApiError(payload?.error ?? `http_${res.status}`, res.status, payload);
  }
  return (json as { data: T }).data;
}

export const apiGet = <T>(path: string, auth = true): Promise<T> =>
  apiFetch<T>(path, { auth });

export const apiPost = <T>(path: string, body: unknown, auth = true): Promise<T> =>
  apiFetch<T>(path, { method: "POST", body, auth });

export const apiPut = <T>(path: string, body: unknown): Promise<T> =>
  apiFetch<T>(path, { method: "PUT", body });

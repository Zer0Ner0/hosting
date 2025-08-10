// frontend/src/lib/api.ts
export type ApiError = { code: string; message: string; details?: unknown };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
if (!API_BASE) {
  // Warn during dev so this never slips by
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_BASE is not set in .env.local");
}

export default async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw { code: "network_error", message: "Load failed" } as ApiError;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err: ApiError = data?.code ? data : { code: "http_error", message: `HTTP ${res.status}` };
    throw err;
  }
  return data as T;
}

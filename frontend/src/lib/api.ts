export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

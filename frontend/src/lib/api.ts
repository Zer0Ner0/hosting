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

// hosting/frontend/src/lib/api.ts
// --- Builder API helpers (append) ---
const API_BASE_BUILDER = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

interface BuilderProject {
  id: number;
  name: string;
  template_slug: string;
  is_published: boolean;
  domain: string;
  settings: unknown | null;
  pages_count: number;
  created_at: string;
  updated_at: string;
}

interface BuilderPage {
  id: number;
  project: number;
  name: string;
  slug: string;
  path: string;
  position: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

interface SyncBlocksResult {
  code: "ok";
  message: string;
  count: number;
}

type Json = Record<string, unknown>;

type JsonInit = Omit<RequestInit, "body"> & { body?: Json | string };

function authFetch<T = unknown>(
  path: string,
  token: string,
  init?: JsonInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body: BodyInit | undefined =
    typeof init?.body === "string"
      ? init.body
      : init?.body !== undefined
      ? JSON.stringify(init.body)
      : undefined;

  return fetch(`${API_BASE_BUILDER}${path}`, { ...(init as RequestInit), headers, body }).then(async (r) => {
    const text = await r.text();
    const data = text ? (JSON.parse(text) as T) : (undefined as unknown as T);
    if (!r.ok) {
      const err = data as unknown as { detail?: string } | undefined;
      throw new Error(err?.detail || `HTTP ${r.status}`);
    }
    return data;
  });
}

export async function listProjects(token: string): Promise<BuilderProject[]> {
  return authFetch<BuilderProject[]>("/api/builder/projects/", token);
}

export async function createProject(
  token: string,
  payload: { name: string; template_slug: string }
): Promise<BuilderProject> {
  return authFetch<BuilderProject>("/api/builder/projects/", token, {
    method: "POST",
    body: payload,
  });
}

export async function listPages(token: string, projectId: number): Promise<BuilderPage[]> {
  return authFetch<BuilderPage[]>(`/api/builder/pages/?project=${projectId}`, token);
}

export async function createPage(
  token: string,
  payload: { project: number; name: string; slug: string; path: string; position: number }
): Promise<BuilderPage> {
  return authFetch<BuilderPage>("/api/builder/pages/", token, { method: "POST", body: payload });
}

export async function syncBlocks(
  token: string,
  pageId: number,
  blocks: Array<{ key: string; enabled: boolean; position: number; props?: unknown }>
): Promise<SyncBlocksResult> {
  return authFetch<SyncBlocksResult>(`/api/builder/pages/${pageId}/sync-blocks/`, token, {
    method: "POST",
    body: { replace: true, blocks },
  });
}

/**
 * High-level helper: upsert project+page then sync blocks.
 * - Finds existing project by template_slug, else creates.
 * - Finds Home page, else creates.
 */
export async function saveBuilderSnapshot(params: {
  token: string;
  templateSlug: string;
  projectName: string;
  order: readonly string[];
  enabled: Readonly<Record<string, boolean>>;
}): Promise<{ projectId: number; pageId: number; synced: number }> {
  const { token, templateSlug, projectName, order, enabled } = params;

  // 1) Project: reuse if same template_slug exists
  const projects = await listProjects(token);
  let project = projects.find((p) => p.template_slug === templateSlug);
  if (!project) {
    project = await createProject(token, { name: projectName, template_slug: templateSlug });
  }

  // 2) Page: reuse 'home' or create
  const pages = await listPages(token, project.id);
  let page = pages.find((p) => p.slug === "home") ?? null;
  if (!page) {
    page = await createPage(token, {
      project: project.id,
      name: "Home",
      slug: "home",
      path: "/",
      position: 0,
    });
  }

  // 3) Blocks: build from UI state
  const blocks = order.map((key, idx) => ({
    key,
    enabled: Boolean(enabled[key]),
    position: idx,
  }));
  const res = await syncBlocks(token, page.id, blocks);

  return { projectId: project.id, pageId: page.id, synced: res.count };
}

export async function registerAccount(payload: any) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Registration failed");
  }
  return res.json();
}
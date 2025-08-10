import fetchJson from "./api";
import type { BlogPost, BlogPostSummary, Tag } from "@/types/Blog";

export function getBlogPosts(tag?: string) {
  const q = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  return fetchJson<BlogPostSummary[]>(`/api/blog/posts/${q}`);
}
export function getBlogPost(slug: string) {
  return fetchJson<BlogPost>(`/api/blog/posts/${encodeURIComponent(slug)}/`);
}
export function getRelatedPosts(slug: string) {
  return fetchJson<BlogPostSummary[]>(`/api/blog/posts/${encodeURIComponent(slug)}/related/`);
}
export function getTags() {
  return fetchJson<Tag[]>(`/api/blog/tags/`);
}

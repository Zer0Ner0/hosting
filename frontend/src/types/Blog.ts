export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image_url?: string;
  author_name?: string;
  tags: string[];
  published_at?: string;
};

export interface Paginated<T> {
  results: T[];
  count: number;
  page: number;
  page_size: number;
}
export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string | null;
  published_at: string | null;
  tags: Tag[];
};

export type AuthorMini = {
  id: number;
  full_name: string;
  email: string;
};

export type BlogPost = BlogPostSummary & {
  author: AuthorMini;
  content: string;
};

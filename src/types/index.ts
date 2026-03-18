export interface Tag {
  name: string;
  slug: string;
  color?: string;
}

export interface PostCoverImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  // Sanity image reference (when loaded from Sanity)
  sanityRef?: string;
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string; // ISO date string
  tags: Tag[];
  coverImage: PostCoverImage;
  featured: boolean;
  /** Plain-text body used for reading-time calculation */
  bodyText: string;
  /** The content source — determines which renderer to use */
  source: "mdx" | "sanity";
  /** Raw MDX string (when source === "mdx") */
  mdxContent?: string;
  /** Sanity Portable Text blocks (when source === "sanity") */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  portableText?: any[];
}

export interface PostSummary {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags: Tag[];
  coverImage: PostCoverImage;
  featured: boolean;
  readingTime: string;
}

export interface PaginatedPosts {
  posts: PostSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetPostsOptions {
  page?: number;
  pageSize?: number;
  tag?: string;
}

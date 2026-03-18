/**
 * Unified content API.
 *
 * When NEXT_PUBLIC_SANITY_PROJECT_ID is set (and not the placeholder),
 * all reads go to Sanity. Otherwise the app falls back to local MDX files
 * in content/posts/ — so the demo always works without CMS credentials.
 *
 * ISR revalidation is controlled at the page/route level via
 * `export const revalidate = 60`, not here.
 */

import type { GetPostsOptions, PaginatedPosts, Post, PostSummary, Tag } from "@/types";
import { getMdxAllPosts, getMdxPostBySlug, toPostSummary } from "./mdx/loader";
import { estimateReadingTime } from "./reading-time";
import { getSanityClient } from "./sanity/client";
import {
  ALL_POST_SUMMARIES_QUERY,
  ALL_SLUGS_QUERY,
  ALL_TAGS_QUERY,
  FEATURED_POST_QUERY,
  POST_BY_SLUG_QUERY,
  POSTS_BY_TAG_QUERY,
  RECENT_POSTS_QUERY,
} from "./sanity/queries";
import type { SanityPost, SanityPostSummary, SanityTag } from "./sanity/types";

// ─── Source detection ─────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const isSanityConfigured = projectId.length > 0 && projectId !== "your-project-id";

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapSanityTag(t: SanityTag): Tag {
  return { name: t.name, slug: t.slug, color: t.color };
}

function mapSanityToSummary(s: SanityPostSummary): PostSummary {
  return {
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    publishedAt: s.publishedAt,
    tags: (s.tags ?? []).map(mapSanityTag),
    coverImage: {
      src: s.coverImage?.src ?? "",
      alt: s.coverImage?.alt ?? "",
    },
    featured: s.featured ?? false,
    readingTime: estimateReadingTime(s.bodyText ?? s.excerpt),
  };
}

function mapSanityToPost(s: SanityPost): Post {
  return {
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    publishedAt: s.publishedAt,
    tags: (s.tags ?? []).map(mapSanityTag),
    coverImage: {
      src: s.coverImage?.src ?? "",
      alt: s.coverImage?.alt ?? "",
      sanityRef: s.coverImage?.asset?._ref,
    },
    featured: s.featured ?? false,
    bodyText: s.bodyText ?? s.excerpt,
    source: "sanity",
    portableText: s.body,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getFeaturedPost(): Promise<PostSummary | null> {
  if (isSanityConfigured) {
    const result = await getSanityClient().fetch<SanityPostSummary | null>(
      FEATURED_POST_QUERY
    );
    return result ? mapSanityToSummary(result) : null;
  }
  const posts = await getMdxAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  return featured ? toPostSummary(featured) : null;
}

export async function getRecentPosts(limit = 6): Promise<PostSummary[]> {
  if (isSanityConfigured) {
    const results = await getSanityClient().fetch<SanityPostSummary[]>(
      RECENT_POSTS_QUERY,
      { limit }
    );
    return results.map(mapSanityToSummary);
  }
  const posts = await getMdxAllPosts();
  return posts.slice(0, limit).map(toPostSummary);
}

export async function getPosts(options: GetPostsOptions = {}): Promise<PaginatedPosts> {
  const { page = 1, pageSize = 9, tag } = options;

  let allPosts: PostSummary[];

  if (isSanityConfigured) {
    const results = tag
      ? await getSanityClient().fetch<SanityPostSummary[]>(POSTS_BY_TAG_QUERY, { tagSlug: tag })
      : await getSanityClient().fetch<SanityPostSummary[]>(ALL_POST_SUMMARIES_QUERY);
    allPosts = results.map(mapSanityToSummary);
  } else {
    const posts = await getMdxAllPosts();
    const filtered = tag ? posts.filter((p) => p.tags.some((t) => t.slug === tag)) : posts;
    allPosts = filtered.map(toPostSummary);
  }

  const total = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paginated = allPosts.slice(start, start + pageSize);

  return { posts: paginated, total, page: safePage, pageSize, totalPages };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSanityConfigured) {
    const result = await getSanityClient().fetch<SanityPost | null>(
      POST_BY_SLUG_QUERY,
      { slug }
    );
    return result ? mapSanityToPost(result) : null;
  }
  return getMdxPostBySlug(slug);
}

export async function getRelatedPosts(tags: Tag[], excludeSlug: string): Promise<PostSummary[]> {
  const tagSlugs = tags.map((t) => t.slug);
  const firstTag = tagSlugs[0];
  if (isSanityConfigured && firstTag) {
    const results = await getSanityClient().fetch<SanityPostSummary[]>(
      POSTS_BY_TAG_QUERY,
      { tagSlug: firstTag }
    );
    return results
      .map(mapSanityToSummary)
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, 3);
  }
  const posts = await getMdxAllPosts();
  return posts
    .filter((p) => p.slug !== excludeSlug && p.tags.some((t) => tagSlugs.includes(t.slug)))
    .slice(0, 3)
    .map(toPostSummary);
}

export async function getAllSlugs(): Promise<string[]> {
  if (isSanityConfigured) {
    const results = await getSanityClient().fetch<{ slug: string }[]>(ALL_SLUGS_QUERY);
    return results.map((r) => r.slug);
  }
  const posts = await getMdxAllPosts();
  return posts.map((p) => p.slug);
}

export async function getAllTags(): Promise<Tag[]> {
  if (isSanityConfigured) {
    const results = await getSanityClient().fetch<SanityTag[]>(ALL_TAGS_QUERY);
    return results.map(mapSanityTag);
  }
  const posts = await getMdxAllPosts();
  const tagMap = new Map<string, Tag>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag.slug, tag);
    }
  }
  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllPostsForRss(): Promise<PostSummary[]> {
  if (isSanityConfigured) {
    const results = await getSanityClient().fetch<SanityPostSummary[]>(ALL_POST_SUMMARIES_QUERY);
    return results.map(mapSanityToSummary);
  }
  const posts = await getMdxAllPosts();
  return posts.map(toPostSummary);
}

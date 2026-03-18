import fs from "fs/promises";
import path from "path";
import type { Post, PostSummary } from "@/types";
import { estimateReadingTime } from "@/lib/reading-time";
import { parseMdx } from "./parser";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

async function getRawFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files.filter((f) => f.endsWith(".mdx")).sort().reverse();
  } catch {
    return [];
  }
}

async function loadPost(filename: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, filename), "utf-8");
    const { frontmatter, content, tags } = parseMdx(raw);
    const bodyText = content.replace(/[#*`>\-_\[\]()!]/g, " ").replace(/\s+/g, " ").trim();
    return {
      title: frontmatter.title,
      slug: frontmatter.slug,
      excerpt: frontmatter.excerpt,
      publishedAt: frontmatter.publishedAt,
      tags,
      coverImage: frontmatter.coverImage,
      featured: frontmatter.featured ?? false,
      bodyText,
      source: "mdx",
      mdxContent: content,
    };
  } catch {
    return null;
  }
}

export async function getMdxAllPosts(): Promise<Post[]> {
  const files = await getRawFiles();
  const posts = await Promise.all(files.map(loadPost));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getMdxPostBySlug(slug: string): Promise<Post | null> {
  const files = await getRawFiles();
  const filename = files.find((f) => f.replace(".mdx", "") === slug);
  if (!filename) return null;
  return loadPost(filename);
}

export function toPostSummary(post: Post): PostSummary {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    tags: post.tags,
    coverImage: post.coverImage,
    featured: post.featured,
    readingTime: estimateReadingTime(post.bodyText),
  };
}

import matter from "gray-matter";
import type { Tag } from "@/types";

export interface MdxFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  coverImage: {
    src: string;
    alt: string;
  };
}

export interface ParsedMdx {
  frontmatter: MdxFrontmatter;
  content: string;
  tags: Tag[];
}

export function parseMdx(raw: string): ParsedMdx {
  const { data, content } = matter(raw);

  const frontmatter = data as MdxFrontmatter;

  const tags: Tag[] = (frontmatter.tags ?? []).map((t: string) => ({
    name: t
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug: t.toLowerCase().replace(/\s+/g, "-"),
  }));

  return { frontmatter, content, tags };
}

import type { MetadataRoute } from "next";
import { getAllSlugs, getAllTags } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://content-blog.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, tags] = await Promise.all([getAllSlugs(), getAllTags()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}

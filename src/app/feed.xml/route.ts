import { getAllPostsForRss } from "@/lib/content";
import { buildRssFeed } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://content-blog.netlify.app";
  const posts = await getAllPostsForRss();
  const xml = buildRssFeed(posts, siteUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

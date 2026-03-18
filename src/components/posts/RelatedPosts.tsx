import { PostCard } from "./PostCard";
import { getRelatedPosts } from "@/lib/content";
import type { Tag } from "@/types";

interface RelatedPostsProps {
  tags: Tag[];
  excludeSlug: string;
}

export async function RelatedPosts({ tags, excludeSlug }: RelatedPostsProps) {
  const posts = await getRelatedPosts(tags, excludeSlug);
  if (posts.length === 0) return null;

  return (
    <aside aria-label="Related articles">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: "var(--color-text)" }}
      >
        Related Articles
      </h2>
      <ul
        className="grid gap-5 list-none p-0 m-0"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
        }}
      >
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

import { PostCard } from "./PostCard";
import type { PostSummary } from "@/types";

interface PostGridProps {
  posts: PostSummary[];
  heading?: string;
}

export function PostGrid({ posts, heading }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <p style={{ color: "var(--color-text-secondary)" }}>No posts found.</p>
    );
  }

  return (
    <section aria-label={heading ?? "Posts"}>
      {heading && (
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: "var(--color-text)" }}
        >
          {heading}
        </h2>
      )}
      <ul
        className="grid gap-6 list-none p-0 m-0"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        }}
      >
        {posts.map((post, i) => (
          <li key={post.slug}>
            <PostCard post={post} priority={i < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}

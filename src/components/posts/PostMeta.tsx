import { formatDate } from "@/lib/utils";
import { TagPill } from "@/components/ui/TagPill";
import type { PostSummary } from "@/types";

interface PostMetaProps {
  post: Pick<PostSummary, "publishedAt" | "readingTime" | "tags">;
  staticTags?: boolean;
}

export function PostMeta({ post, staticTags = false }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <time
        dateTime={post.publishedAt}
        className="text-sm"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        {formatDate(post.publishedAt)}
      </time>
      <span aria-hidden="true" style={{ color: "var(--color-border)" }}>
        ·
      </span>
      <span
        className="text-sm"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        {post.readingTime}
      </span>
      {post.tags.length > 0 && (
        <>
          <span aria-hidden="true" style={{ color: "var(--color-border)" }}>
            ·
          </span>
          <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag.slug}>
                <TagPill tag={tag} static={staticTags} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

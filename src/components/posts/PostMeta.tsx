import { formatDate } from "@/lib/utils";
import { TagPill } from "@/components/ui/TagPill";
import type { PostSummary } from "@/types";

interface PostMetaProps {
  post: Pick<PostSummary, "publishedAt" | "readingTime" | "tags">;
  staticTags?: boolean;
}

export function PostMeta({ post, staticTags = false }: PostMetaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-center gap-x-2 text-sm"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        <time dateTime={post.publishedAt} style={{ color: "var(--color-text-secondary)" }}>
          {formatDate(post.publishedAt)}
        </time>
        <span aria-hidden="true" style={{ color: "var(--color-border)" }}>·</span>
        <span style={{ color: "var(--color-text-muted)" }}>{post.readingTime}</span>
      </div>
      {post.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag.slug}>
              <TagPill tag={tag} static={staticTags} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

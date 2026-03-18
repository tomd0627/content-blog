import Image from "next/image";
import Link from "next/link";
import { PostMeta } from "./PostMeta";
import type { PostSummary } from "@/types";

interface PostCardProps {
  post: PostSummary;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article
      className="flex flex-col rounded-xl overflow-hidden border transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block overflow-hidden no-underline"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-video w-full bg-surface">
          <Image
            src={post.coverImage.src || "/og-default.svg"}
            alt={post.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <PostMeta post={post} />

        <h2 className="text-lg font-bold leading-snug m-0">
          <Link
            href={`/blog/${post.slug}`}
            className="post-card-title-link"
          >
            {post.title}
          </Link>
        </h2>

        <p
          className="text-sm leading-relaxed m-0 line-clamp-2 flex-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium no-underline mt-auto self-start"
          style={{ color: "var(--color-accent)" }}
          aria-label={`Read "${post.title}"`}
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}

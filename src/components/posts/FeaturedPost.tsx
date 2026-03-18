import Image from "next/image";
import Link from "next/link";
import { PostMeta } from "./PostMeta";
import { ButtonLink } from "@/components/ui/Button";
import type { PostSummary } from "@/types";

interface FeaturedPostProps {
  post: PostSummary;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--color-border)" }}
      aria-label={`Featured: ${post.title}`}
    >
      {/* Background image */}
      <div className="relative h-80 sm:h-96 w-full">
        <Image
          src={post.coverImage.src || "/og-default.svg"}
          alt={post.coverImage.alt}
          fill
          sizes="(min-width: 1200px) 1152px, 100vw"
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        {/* Featured badge */}
        <span
          className="inline-flex self-start mb-4 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          Featured
        </span>

        <div className="mb-4">
          <PostMeta post={post} staticTags />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold leading-tight mb-4"
          style={{ color: "white" }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="no-underline hover:underline"
            style={{ color: "white" }}
          >
            {post.title}
          </Link>
        </h2>

        <p
          className="text-base leading-relaxed mb-5 max-w-2xl line-clamp-2"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {post.excerpt}
        </p>

        <ButtonLink href={`/blog/${post.slug}`} variant="primary">
          Read article
        </ButtonLink>
      </div>
    </article>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { PostGrid } from "@/components/posts/PostGrid";
import { Pagination } from "@/components/ui/Pagination";
import { TagFilter } from "@/components/ui/TagFilter";
import { getAllTags, getPosts } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "All articles on front-end development, accessibility, performance, and more.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageStr, tag } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const [{ posts, totalPages }, allTags] = await Promise.all([
    getPosts({ page, tag, pageSize: 9 }),
    getAllTags(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {tag
            ? `Articles tagged "${allTags.find((t) => t.slug === tag)?.name ?? tag}"`
            : "All Articles"}
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Writing on front-end development, accessibility, performance, and the craft of building for the web.
        </p>
      </div>

      {/* Tag filter */}
      <Suspense>
        <TagFilter tags={allTags} activeTag={tag} />
      </Suspense>

      {/* Posts */}
      <PostGrid posts={posts} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/blog"
        extraParams={tag ? { tag } : undefined}
      />
    </div>
  );
}

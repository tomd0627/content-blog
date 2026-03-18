import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/posts/PostGrid";
import { getAllTags, getPosts } from "@/lib/content";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const allTags = await getAllTags();
  const tagData = allTags.find((t) => t.slug === tag);
  if (!tagData) return {};
  return {
    title: `Articles tagged "${tagData.name}"`,
    description: `All articles tagged with ${tagData.name}.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const allTags = await getAllTags();
  const tagData = allTags.find((t) => t.slug === tag);
  if (!tagData) notFound();

  const { posts } = await getPosts({ tag, pageSize: 100 });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <p
          className="text-sm font-medium uppercase tracking-wide mb-2"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          Tag
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {tagData.name}
        </h1>
      </header>

      <PostGrid posts={posts} />
    </div>
  );
}

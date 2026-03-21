import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { getAllSlugs, getPostBySlug } from "@/lib/content";
import { PostMeta } from "@/components/posts/PostMeta";
import { RelatedPosts } from "@/components/posts/RelatedPosts";
import { ReadingProgress } from "@/components/posts/ReadingProgress";
import { TableOfContents } from "@/components/posts/TableOfContents";
import { BackToTop } from "@/components/ui/BackToTop";
import { JsonLd } from "@/components/ui/JsonLd";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { PortableTextRenderer } from "@/components/content/PortableTextRenderer";
import { estimateReadingTime } from "@/lib/reading-time";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://content-blog.netlify.app";

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags.map((t) => t.name),
      images: [
        post.coverImage.src
          ? { url: post.coverImage.src, width: 1200, height: 630, alt: post.coverImage.alt }
          : { url: `${siteUrl}/og-default.svg`, width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readingTime = estimateReadingTime(post.bodyText);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://content-blog.netlify.app";

  const postSummary = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    tags: post.tags,
    coverImage: post.coverImage,
    featured: post.featured,
    readingTime,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: post.coverImage.src || `${siteUrl}/og-default.svg`,
    url: `${siteUrl}/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: "Field Notes",
    },
    publisher: {
      "@type": "Organization",
      name: "Field Notes",
      url: siteUrl,
    },
    keywords: post.tags.map((t) => t.name).join(", "),
  };

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />

      <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Post header */}
        <header className="mb-10 max-w-3xl">
          <PostMeta post={postSummary} />
          <h1
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {post.title}
          </h1>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {post.excerpt}
          </p>
        </header>

        {/* Cover image */}
        {post.coverImage.src && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10">
            <Image
              src={post.coverImage.src}
              alt={post.coverImage.alt}
              fill
              sizes="(min-width: 1200px) 1152px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Two-column layout: content + TOC */}
        <div className="flex gap-12 items-start">
          {/* Article body */}
          <div className="flex-1 min-w-0">
            {post.source === "mdx" && post.mdxContent ? (
              <MDXRenderer source={post.mdxContent} />
            ) : post.portableText ? (
              <PortableTextRenderer value={post.portableText} />
            ) : null}
          </div>

          {/* Sticky TOC — desktop only */}
          <aside
            className="hidden xl:block w-60 shrink-0 sticky top-24 self-start"
            aria-label="Table of contents"
          >
            <Suspense fallback={null}>
              <TableOfContents />
            </Suspense>
          </aside>
        </div>
      </article>

      {/* Related posts */}
      <Suspense fallback={null}>
        <RelatedPosts tags={post.tags} excludeSlug={post.slug} />
      </Suspense>

      <BackToTop />
    </>
  );
}

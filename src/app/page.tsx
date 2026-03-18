import { FeaturedPost } from "@/components/posts/FeaturedPost";
import { PostGrid } from "@/components/posts/PostGrid";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedPost, getRecentPosts } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedPost(),
    getRecentPosts(6),
  ]);

  // Exclude the featured post from the recent grid
  const grid = featured
    ? recent.filter((p) => p.slug !== featured.slug)
    : recent;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Hero */}
      <section aria-label="Hero">
        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Field Notes
          </h1>
          <p
            className="text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Thoughtful writing on front-end development, accessibility,
            performance, and the craft of building for the web.
          </p>
        </div>
        {featured && <FeaturedPost post={featured} />}
      </section>

      {/* Recent posts */}
      {grid.length > 0 && (
        <section aria-label="Recent posts">
          <PostGrid posts={grid} heading="Recent Articles" />
          <div className="mt-10 text-center">
            <ButtonLink href="/blog" variant="outline">
              View all articles
            </ButtonLink>
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { ButtonLink } from "@/components/ui/Button";

export default function PostError() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
        Could not load this article
      </h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        There was a problem fetching this post. Please try again later.
      </p>
      <ButtonLink href="/blog" variant="primary">
        Back to all articles
      </ButtonLink>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Tag } from "@/types";

interface TagFilterProps {
  tags: Tag[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (tags.length === 0) return null;

  const setTag = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("tag", slug);
    } else {
      params.delete("tag");
    }
    params.delete("page"); // reset to page 1 on tag change
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8" role="group" aria-label="Filter by tag">
      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
        <li>
          <button
            type="button"
            onClick={() => setTag(null)}
            className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer"
            style={
              !activeTag
                ? {
                    backgroundColor: "var(--color-text)",
                    color: "var(--color-bg)",
                    borderColor: "var(--color-text)",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "var(--color-text-secondary)",
                    borderColor: "var(--color-border)",
                  }
            }
            aria-pressed={!activeTag}
          >
            All
          </button>
        </li>
        {tags.map((tag) => {
          const isActive = activeTag === tag.slug;
          return (
            <li key={tag.slug}>
              <button
                type="button"
                onClick={() => setTag(tag.slug)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-accent)",
                        color: "white",
                        borderColor: "var(--color-accent)",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--color-text-secondary)",
                        borderColor: "var(--color-border)",
                      }
                }
                aria-pressed={isActive}
              >
                {tag.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

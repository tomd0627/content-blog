"use client";

import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  contentId?: string;
}

export function TableOfContents({ contentId = "post-content" }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) return;

    const headings = Array.from(
      content.querySelectorAll<HTMLHeadingElement>("h2, h3")
    );

    const tocItems: TocItem[] = headings.map((h) => {
      // Ensure each heading has an id
      if (!h.id) {
        h.id = h.textContent
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-") ?? "";
      }
      return {
        id: h.id,
        text: h.textContent ?? "",
        level: (parseInt(h.tagName[1] ?? "2") as 2 | 3),
      };
    });

    setItems(tocItems);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observerRef.current?.observe(h));

    return () => observerRef.current?.disconnect();
  }, [contentId]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p
        className="font-semibold mb-3 uppercase tracking-wide text-xs"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        On this page
      </p>
      <ol className="list-none p-0 m-0 space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0" }}
          >
            <a
              href={`#${item.id}`}
              aria-label={`Jump to section: ${item.text}`}
              className="block py-0.5 no-underline transition-colors leading-snug"
              style={{
                color:
                  activeId === item.id
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                borderLeft:
                  activeId === item.id
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                paddingLeft: "0.5rem",
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

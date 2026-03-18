import Link from "next/link";
import type { Tag } from "@/types";

interface TagPillProps {
  tag: Tag;
  /** If true, renders as a non-interactive span */
  static?: boolean;
}

export function TagPill({ tag, static: isStatic = false }: TagPillProps) {
  const style: React.CSSProperties = tag.color
    ? {
        backgroundColor: `${tag.color}22`,
        color: tag.color,
        borderColor: `${tag.color}44`,
      }
    : {
        backgroundColor: "var(--color-accent-light)",
        color: "var(--color-accent)",
        borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)",
      };

  const className =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border no-underline transition-opacity hover:opacity-80";

  if (isStatic) {
    return (
      <span className={className} style={style}>
        {tag.name}
      </span>
    );
  }

  return (
    <Link
      href={`/tags/${tag.slug}`}
      className={className}
      style={style}
    >
      {tag.name}
    </Link>
  );
}

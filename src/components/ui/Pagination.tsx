import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Base path, e.g. "/blog" */
  basePath: string;
  /** Extra query params to preserve, e.g. { tag: "react" } */
  extraParams?: Record<string, string>;
}

function buildHref(
  basePath: string,
  page: number,
  extraParams?: Record<string, string>
): string {
  const params = new URLSearchParams(extraParams);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Build visible page numbers (show up to 5 pages around current)
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const linkStyle: React.CSSProperties = {
    color: "var(--color-text-secondary)",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-surface)",
  };
  const activeStyle: React.CSSProperties = {
    color: "white",
    backgroundColor: "var(--color-accent)",
    borderColor: "var(--color-accent)",
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildHref(basePath, currentPage - 1, extraParams)}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm no-underline transition-opacity hover:opacity-75"
          style={linkStyle}
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm opacity-40 cursor-not-allowed"
          style={linkStyle}
          aria-disabled="true"
          aria-label="Previous page"
        >
          ←
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(basePath, page, extraParams)}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm no-underline transition-opacity hover:opacity-75"
          style={page === currentPage ? activeStyle : linkStyle}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildHref(basePath, currentPage + 1, extraParams)}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm no-underline transition-opacity hover:opacity-75"
          style={linkStyle}
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm opacity-40 cursor-not-allowed"
          style={linkStyle}
          aria-disabled="true"
          aria-label="Next page"
        >
          →
        </span>
      )}
    </nav>
  );
}

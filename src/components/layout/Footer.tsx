import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t py-10"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-dm-mono), monospace" }}
          >
            &copy; {currentYear} Field Notes
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex items-center list-none gap-4 m-0 p-0">
              <li>
                <Link
                  href="/blog"
                  className="text-sm no-underline"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  className="flex items-center gap-1.5 text-sm no-underline"
                  style={{ color: "var(--color-text-secondary)", lineHeight: 1 }}
                  aria-label="RSS feed"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                  RSS
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

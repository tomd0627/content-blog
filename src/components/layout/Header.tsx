"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 85%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
            aria-label="Home"
          >
            {/* SVG quill mark */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="14" fill="var(--color-accent)" />
              <path
                d="M8 20c2-4 5-8 10-10-2 1-4 3-5 6l3-2c-1 2-2 4-2 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <line
                x1="9"
                y1="20"
                x2="13"
                y2="20"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-lg font-bold tracking-tight hidden sm:block"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "var(--color-text)" }}
            >
              Field Notes
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {/* Navigation */}
            <nav aria-label="Main navigation">
              <ul className="flex list-none gap-1 m-0 p-0">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className="px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-colors"
                        style={{
                          color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                          backgroundColor: isActive ? "var(--color-accent-light)" : "transparent",
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-md transition-colors"
              style={{
                color: "var(--color-text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

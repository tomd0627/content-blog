export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      style={{
        backgroundColor: "var(--color-surface-raised)",
        color: "var(--color-text)",
        border: "2px solid var(--color-focus)",
      }}
    >
      Skip to main content
    </a>
  );
}

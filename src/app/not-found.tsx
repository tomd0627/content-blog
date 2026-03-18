import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center space-y-6">
      <p
        className="text-8xl font-bold leading-none"
        style={{
          color: "var(--color-accent)",
          fontFamily: "var(--font-lora), Georgia, serif",
        }}
        aria-hidden="true"
      >
        404
      </p>
      <h1
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Page not found
      </h1>
      <p
        className="text-base max-w-md mx-auto"
        style={{ color: "var(--color-text-secondary)" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <ButtonLink href="/blog" variant="primary">
        Browse all articles
      </ButtonLink>
    </div>
  );
}

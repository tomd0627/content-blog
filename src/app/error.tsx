"use client";

import { ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
        Something went wrong
      </h1>
      <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
        {error.message ?? "An unexpected error occurred."}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-md text-sm font-medium"
          style={{ backgroundColor: "var(--color-accent)", color: "white" }}
        >
          Try again
        </button>
        <ButtonLink href="/" variant="ghost">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}

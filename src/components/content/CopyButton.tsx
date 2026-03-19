"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code"}
      className="flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-opacity hover:opacity-100 opacity-50"
      style={{
        color: copied ? "var(--color-sage)" : "var(--color-text-muted)",
        fontFamily: "var(--font-dm-mono), monospace",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

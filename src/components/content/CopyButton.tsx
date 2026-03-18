"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code"}
      className="absolute top-3 right-3 flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-opacity hover:opacity-100 opacity-60"
      style={{
        backgroundColor: "rgba(255,255,255,0.1)",
        color: copied ? "var(--color-sage)" : "rgba(255,255,255,0.8)",
        fontFamily: "var(--font-dm-mono), monospace",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeBlock({ code, language = "text", filename }: CodeBlockProps) {
  let highlighted = "";
  try {
    highlighted = await codeToHtml(code, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  } catch {
    // Fallback for unsupported languages
    highlighted = `<pre><code>${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`;
  }

  return (
    <div
      className="relative group my-6 rounded-lg overflow-hidden border"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 text-xs border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          fontFamily: "var(--font-dm-mono), monospace",
          color: "var(--color-text-muted)",
        }}
      >
        <span>{filename ?? language}</span>
      </div>

      {/* Code */}
      <div className="relative">
        <div
          className="overflow-x-auto text-sm"
          // Shiki generates light/dark themes via CSS vars — we wire them to our theme
          style={{ "--shiki-light-bg": "var(--color-surface)", "--shiki-dark-bg": "#1c2b1c" } as React.CSSProperties}
          // biome-ignore lint: safe — Shiki output is server-generated, no user input
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        <CopyButton code={code} />
      </div>
    </div>
  );
}

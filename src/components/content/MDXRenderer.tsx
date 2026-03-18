import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";

interface MDXRendererProps {
  source: string;
}

const components = {
  // Custom image with next/image
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    return (
      <figure className="my-8">
        <Image
          src={src}
          alt={alt ?? ""}
          width={800}
          height={450}
          className="rounded-lg w-full object-cover"
        />
        {alt && (
          <figcaption className="text-center text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  // Code blocks via pre+code (MDX parses fenced code blocks to these)
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeEl = children as React.ReactElement<{
      className?: string;
      children?: string;
    }>;
    const className = codeEl?.props?.className ?? "";
    const language = className.replace(/language-/, "") || "text";
    const code = (codeEl?.props?.children ?? "").toString().trim();
    return <CodeBlock code={code} language={language} />;
  },
  // Callout shortcodes
  Callout,
};

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div id="post-content" className="prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}

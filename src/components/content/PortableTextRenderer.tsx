import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import { urlForImage } from "@/lib/sanity/image";
import { headingToId } from "@/lib/utils";
import type { PortableTextBlock } from "@/lib/sanity/types";

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

const components = {
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref: string }; alt?: string; caption?: string };
    }) => {
      if (!value.asset?._ref) return null;
      const url = urlForImage(value).width(800).url();
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={800}
            height={450}
            className="rounded-lg w-full object-cover"
          />
          {value.caption && (
            <figcaption
              className="text-center text-sm mt-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({
      value,
    }: {
      value: { language?: string; filename?: string; code: string };
    }) => (
      <CodeBlock
        code={value.code}
        language={value.language}
        filename={value.filename}
      />
    ),
    callout: ({
      value,
    }: {
      value: { type: "info" | "warning" | "tip"; text: string };
    }) => <Callout type={value.type}>{value.text}</Callout>,
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children ?? "");
      return (
        <h2 id={headingToId(text)}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children ?? "");
      return (
        <h3 id={headingToId(text)}>
          {children}
        </h3>
      );
    },
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4>{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote>{children}</blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p>{children}</p>
    ),
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href: string; blank?: boolean };
      children?: React.ReactNode;
    }) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={value?.blank || isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
    code: ({ children }: { children?: React.ReactNode }) => (
      <code>{children}</code>
    ),
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div id="post-content" className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}

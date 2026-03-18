import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "text-white no-underline",
  ghost: "no-underline",
  outline: "no-underline border",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2";

function getInlineStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--color-accent)",
        color: "white",
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: "var(--color-text-secondary)",
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        color: "var(--color-text)",
        borderColor: "var(--color-border)",
      };
  }
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(baseClass, variantClasses[variant], className)}
      style={getInlineStyle(variant)}
    />
  );
}

export function ButtonLink({ href, variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      {...props}
      className={cn(baseClass, variantClasses[variant], className)}
      style={getInlineStyle(variant)}
    >
      {children}
    </Link>
  );
}

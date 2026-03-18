type CalloutType = "info" | "warning" | "tip";

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const icons: Record<CalloutType, string> = {
  info: "ℹ",
  warning: "⚠",
  tip: "💡",
};

const styles: Record<CalloutType, React.CSSProperties> = {
  info: {
    backgroundColor: "color-mix(in srgb, var(--color-sage) 15%, var(--color-bg))",
    borderColor: "var(--color-sage)",
    color: "var(--color-text)",
  },
  warning: {
    backgroundColor: "color-mix(in srgb, #f59e0b 15%, var(--color-bg))",
    borderColor: "#f59e0b",
    color: "var(--color-text)",
  },
  tip: {
    backgroundColor: "var(--color-accent-light)",
    borderColor: "var(--color-accent)",
    color: "var(--color-text)",
  },
};

export function Callout({ type, children }: CalloutProps) {
  return (
    <aside
      className="flex gap-3 rounded-lg border p-4 my-6 text-sm leading-relaxed"
      style={styles[type]}
      role="note"
    >
      <span aria-hidden="true" className="text-base shrink-0 mt-0.5">
        {icons[type]}
      </span>
      <div>{children}</div>
    </aside>
  );
}

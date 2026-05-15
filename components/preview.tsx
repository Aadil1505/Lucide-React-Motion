import type { ReactNode } from "react";

interface PreviewProps {
  children: ReactNode;
  /**
   * Wider gap between children. Use when showing several demos side-by-side
   * (e.g. a comparison row) so they breathe.
   */
  wide?: boolean;
}

/**
 * Bordered container for a live demo inside an MDX page. Wrap the icon(s)
 * users should hover with this so they sit visually distinct from prose.
 */
export function Preview({ children, wide = false }: PreviewProps) {
  return (
    <div
      className={
        "not-prose my-6 flex min-h-32 flex-wrap items-center justify-center rounded-lg border border-fd-border bg-fd-card p-8 " +
        (wide ? "gap-10" : "gap-6")
      }
    >
      {children}
    </div>
  );
}

interface DemoProps {
  children: ReactNode;
  label?: string;
}

/** Caption a live element with a small monospace label underneath. */
export function Demo({ children, label }: DemoProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      {label && (
        <code className="text-[10px] text-fd-muted-foreground">{label}</code>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

interface CopyLineProps {
  /** The code snippet rendered in the block. */
  value: string;
  /** Optional label rendered as an eyebrow above the block. */
  label?: string;
}

/**
 * A single-line code snippet with a click-to-copy button. Used on icon detail
 * pages for import lines.
 */
export function CopyLine({ value, label }: CopyLineProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard?.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard write failed (older browser, insecure context) - silent.
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          {label}
        </div>
      )}
      <div className="flex items-stretch gap-0 border border-line bg-paper-dim/50">
        <pre className="flex-1 overflow-x-auto px-3 py-2 text-xs">
          <code>{value}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          className="border-l border-line bg-paper px-3 text-[10px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:bg-ink hover:text-paper"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
    </div>
  );
}

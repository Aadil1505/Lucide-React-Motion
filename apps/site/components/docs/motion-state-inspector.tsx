"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react-motion";
import type { MotionIconHandle, MotionState, Trigger } from "lucide-react-motion";
import { cn } from "@/lib/utils";

const TRIGGERS: { value: Trigger; label: string }[] = [
  { value: "hover", label: "hover" },
  { value: "parent-hover", label: "parent-hover" },
  { value: "click", label: "click" },
];

const STATE_COLORS: Record<MotionState, string> = {
  resting: "bg-zinc-400 dark:bg-zinc-600",
  drawing: "bg-amber-500",
  complete: "bg-emerald-500",
};

interface LogEntry {
  state: MotionState;
  at: number;
}

/**
 * Live inspector that reads `data-motion-state` off the rendered <svg> via a
 * MutationObserver and shows the current state plus the last few transitions.
 */
export function MotionStateInspector() {
  const [trigger, setTrigger] = useState<Trigger>("hover");
  const [state, setState] = useState<MotionState>("resting");
  const [log, setLog] = useState<LogEntry[]>([
    { state: "resting", at: Date.now() },
  ]);
  const iconRef = useRef<MotionIconHandle>(null);

  // Reset state and log whenever the trigger changes so the demo doesn't
  // carry stale entries from the previous trigger's behavior.
  useEffect(() => {
    setState("resting");
    setLog([{ state: "resting", at: Date.now() }]);
  }, [trigger]);

  // Observe the attribute the engine writes. The icon is remounted whenever
  // `trigger` changes (because we pass a different `key`), so binding here is
  // straightforward.
  useEffect(() => {
    const svg = iconRef.current?.node;
    if (!svg) return;

    const read = () => {
      const next = (svg.getAttribute("data-motion-state") ??
        "resting") as MotionState;
      setState(next);
      // Dedupe based on the last entry — keep this out of the setState
      // updater so StrictMode's double-invocation doesn't append twice.
      setLog((entries) => {
        const last = entries[entries.length - 1];
        if (last && last.state === next) return entries;
        return [...entries.slice(-9), { state: next, at: Date.now() }];
      });
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(svg, {
      attributes: true,
      attributeFilter: ["data-motion-state"],
    });
    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div className="flex flex-col gap-4 rounded-md border border-fd-border bg-fd-card p-4">
      {/* Trigger selector */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fd-muted-foreground">trigger:</span>
        {TRIGGERS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTrigger(opt.value)}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
              trigger === opt.value
                ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
                : "border-fd-border bg-transparent hover:bg-fd-accent"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Interaction surface + live state readout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          data-motion-icon-group
          className={cn(
            "flex h-32 w-full items-center justify-center rounded-md border border-dashed border-fd-border bg-fd-background sm:w-48",
            // Subtle hint that the parent is the hover target for parent-hover
            trigger === "parent-hover" &&
              "hover:border-fd-primary hover:bg-fd-accent"
          )}
        >
          <Heart
            key={trigger}
            ref={iconRef}
            size={56}
            trigger={trigger}
            duration={2}
            stagger={0.35}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-fd-muted-foreground">current:</span>
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-full",
                STATE_COLORS[state]
              )}
              aria-hidden
            />
            <code className="font-mono">{state}</code>
          </div>

          <div className="text-xs text-fd-muted-foreground">
            {trigger === "hover" && "Move your cursor over the heart."}
            {trigger === "parent-hover" &&
              "Move your cursor over the bordered box."}
            {trigger === "click" && "Click the heart to fire the draw."}
          </div>
        </div>
      </div>

      {/* Transition log */}
      <div className="rounded-md border border-fd-border bg-fd-background p-3">
        <div className="mb-2 text-xs uppercase tracking-wide text-fd-muted-foreground">
          recent transitions
        </div>
        <ol className="flex flex-col gap-1 font-mono text-xs">
          {log.map((entry, i) => {
            const prev = log[i - 1];
            const delta = prev ? entry.at - prev.at : 0;
            return (
              <li
                key={`${entry.at}-${i}`}
                className="flex items-center gap-2"
              >
                <span
                  className={cn(
                    "inline-block h-2 w-2 shrink-0 rounded-full",
                    STATE_COLORS[entry.state]
                  )}
                  aria-hidden
                />
                <span>{entry.state}</span>
                {i > 0 && (
                  <span className="text-fd-muted-foreground">
                    +{delta}ms
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

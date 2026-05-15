"use client";

import { useRef } from "react";
import { Rocket } from "@/src/generated";
import type { MotionIconHandle } from "@/src/engine";

/** Live demo for the `trigger="manual"` docs page. */
export function ManualTrigger() {
  const iconRef = useRef<MotionIconHandle>(null);

  return (
    <div className="flex items-center gap-6">
      <Rocket size={48} trigger="manual" ref={iconRef} />
      <button
        type="button"
        onClick={() => iconRef.current?.play()}
        className="rounded-md border border-fd-border bg-fd-card px-3 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        play()
      </button>
    </div>
  );
}

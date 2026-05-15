"use client";

import { useRef, useState, type ComponentType } from "react";
import type { DrawIconProps, MotionIconHandle, Trigger } from "@/src/engine";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;

const TRIGGERS: Trigger[] = [
  "hover",
  "click",
  "mount",
  "in-view",
  "parent-hover",
  "manual",
];

interface IconHeroProps {
  Icon: IconComponent;
  name: string;
}

/**
 * Large playable preview at the top of the detail page. Users can flip
 * between trigger modes to see each one in action.
 */
export function IconHero({ Icon, name }: IconHeroProps) {
  const [trigger, setTrigger] = useState<Trigger>("hover");
  // Key changes whenever trigger changes so the icon remounts cleanly - lets
  // `mount` fire on every selection, and avoids stale Motion controls state.
  const [generation, setGeneration] = useState(0);
  const handleRef = useRef<MotionIconHandle>(null);

  const select = (next: Trigger) => {
    setTrigger(next);
    setGeneration((g) => g + 1);
  };

  const iconElement = (
    <Icon
      key={generation}
      size={180}
      strokeWidth={1.5}
      trigger={trigger}
      ref={handleRef}
    />
  );

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-background/40 p-10">
      {trigger === "parent-hover" ? (
        <button
          type="button"
          data-motion-icon-group
          className="rounded-md border border-border p-6 hover:bg-secondary/50"
        >
          {iconElement}
        </button>
      ) : (
        iconElement
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {TRIGGERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => select(t)}
            data-active={t === trigger}
            className="border border-border px-3 py-1 text-[11px] uppercase tracking-[0.1em] transition-colors hover:bg-secondary/60 data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-foreground"
          >
            {t}
          </button>
        ))}
        {trigger === "manual" && (
          <button
            type="button"
            onClick={() => handleRef.current?.play()}
            className="border border-primary bg-primary px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-foreground hover:border-foreground hover:text-background"
          >
            play()
          </button>
        )}
      </div>

      <p className="max-w-md text-center text-xs text-muted-foreground">
        {triggerHint(trigger, name)}
      </p>
    </div>
  );
}

function triggerHint(trigger: Trigger, name: string): string {
  switch (trigger) {
    case "hover":
      return `Hover the ${name} icon above to see the default draw animation.`;
    case "click":
      return "Click the icon to replay the draw. Pointer cursor is applied automatically.";
    case "mount":
      return "The icon plays once when it appears. Select another trigger and click `mount` again to replay.";
    case "in-view":
      return "Animates each time the icon scrolls into the viewport.";
    case "parent-hover":
      return "The icon is wrapped in a button. Hover the button - not the icon - to fire the animation.";
    case "manual":
      return "Click `play()` to fire the animation imperatively via a ref handle.";
  }
}

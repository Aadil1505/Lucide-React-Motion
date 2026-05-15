"use client";

import type { ComponentType } from "react";
import type { DrawIconProps } from "@/src/engine";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;

interface TimingPresetsProps {
  Icon: IconComponent;
}

/**
 * Four common timing presets demonstrated side-by-side. Lets a visitor flip
 * between styles without authoring code first.
 */
export function TimingPresets({ Icon }: TimingPresetsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Preset label="Snappy" code='duration={0.2} stagger={0}'>
        <Icon size={56} duration={0.2} stagger={0} />
      </Preset>
      <Preset label="Cinematic" code='duration={1.5} stagger={0.4}'>
        <Icon size={56} duration={1.5} stagger={0.4} />
      </Preset>
      <Preset label="Linear" code='easing="linear"'>
        <Icon size={56} easing="linear" />
      </Preset>
      <Preset
        label="Spinner"
        code='trigger="mount" repeat={Infinity}'
      >
        <Icon
          size={56}
          trigger="mount"
          repeat={Infinity}
          duration={1.4}
          easing="linear"
        />
      </Preset>
    </div>
  );
}

function Preset({
  label,
  code,
  children,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 border border-line bg-paper/40 p-4">
      <div className="flex h-20 items-center justify-center">{children}</div>
      <div className="space-y-1 text-center">
        <div className="text-[10px] uppercase tracking-[0.14em] text-ink">
          {label}
        </div>
        <code className="text-[9px] text-ink-soft">{code}</code>
      </div>
    </div>
  );
}

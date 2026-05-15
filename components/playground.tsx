"use client";

import { useRef, type ReactNode } from "react";
import {
  Bell,
  Heart,
  Rocket,
  Send,
  Settings,
  Sparkles,
  Star,
  Zap,
} from "@/src/generated";
import { MotionIconConfig, type MotionIconHandle } from "@/src/engine";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border last:border-b-0">
      <h3 className="border-b border-border bg-secondary px-5 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-8 px-5 py-6">
        {children}
      </div>
    </section>
  );
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-[88px] flex-col items-center gap-2">
      {children}
      <code className="text-[10px] tracking-tight text-muted-foreground">{label}</code>
    </div>
  );
}

function ButtonDemo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        data-motion-icon-group
        className="inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
      >
        {children}
      </button>
      <code className="text-[10px] tracking-tight text-muted-foreground">{label}</code>
    </div>
  );
}

export function Playground() {
  const manualRef = useRef<MotionIconHandle>(null);

  return (
    <div className="border border-border bg-background">
      <Section title="Timing — hover each">
        <Demo label="defaults"><Heart size={36} /></Demo>
        <Demo label="duration=0.15"><Heart size={36} duration={0.15} /></Demo>
        <Demo label="duration=2.5"><Heart size={36} duration={2.5} /></Demo>
        <Demo label="delay=0.5"><Settings size={36} delay={0.5} /></Demo>
        <Demo label="stagger=0.4"><Rocket size={36} stagger={0.4} /></Demo>
        <Demo label="stagger=0"><Sparkles size={36} stagger={0} /></Demo>
        <Demo label="easing=linear"><Heart size={36} easing="linear" /></Demo>
        <Demo label="repeat=Infinity">
          <Settings size={36} repeat={Infinity} duration={1.2} />
        </Demo>
      </Section>

      <Section title="Trigger modes">
        <Demo label='trigger="hover"'>
          <Heart size={36} trigger="hover" />
        </Demo>
        <Demo label='trigger="click"'>
          <Bell size={36} trigger="click" />
        </Demo>
        <Demo label='trigger="mount"'>
          <Star size={36} trigger="mount" />
        </Demo>
        <Demo label='trigger="in-view"'>
          <Zap size={36} trigger="in-view" />
        </Demo>
        <ButtonDemo label='trigger="parent-hover"'>
          Hover the button
          <Send size={16} trigger="parent-hover" />
        </ButtonDemo>
        <div className="flex flex-col items-center gap-2">
          <Rocket size={36} trigger="manual" ref={manualRef} />
          <button
            type="button"
            onClick={() => manualRef.current?.play()}
            className="border border-foreground px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
          >
            play()
          </button>
          <code className="text-[10px] text-muted-foreground">
            trigger=&quot;manual&quot;
          </code>
        </div>
      </Section>

      <Section title="Leave behavior — hover, then move away">
        <Demo label='onLeave="complete" (default)'><Heart size={36} /></Demo>
        <Demo label='onLeave="snap"'><Heart size={36} onLeave="snap" /></Demo>
        <Demo label='onLeave="redraw"'>
          <Heart size={36} onLeave="redraw" />
        </Demo>
      </Section>

      <Section title="Custom variants override · replace draw entirely">
        <Demo label="pulse">
          <Heart
            size={36}
            variants={{
              rest: { scale: 1 },
              active: {
                scale: [1, 1.3, 1],
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
            style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
          />
        </Demo>
        <Demo label="spin">
          <Settings
            size={36}
            variants={{
              rest: { rotate: 0 },
              active: { rotate: 360, transition: { duration: 0.6 } },
            }}
            style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
          />
        </Demo>
        <Demo label="staggered wiggle (fn)">
          <Sparkles
            size={36}
            variants={(i) => ({
              rest: { rotate: 0 },
              active: {
                rotate: [0, -15, 12, -8, 0],
                transition: { duration: 0.5, delay: i * 0.06 },
              },
            })}
            style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
          />
        </Demo>
      </Section>

      <Section title="MotionIconConfig provider · shared defaults">
        <MotionIconConfig duration={0.2} stagger={0.04} easing="linear">
          <Demo label="inherits config"><Heart size={36} /></Demo>
          <Demo label="inherits config"><Settings size={36} /></Demo>
          <Demo label="overrides duration">
            <Rocket size={36} duration={1.4} />
          </Demo>
        </MotionIconConfig>
      </Section>

      <Section title="absoluteStrokeWidth · Lucide parity">
        <Demo label="size=24">
          <Heart size={24} strokeWidth={2} />
        </Demo>
        <Demo label="size=64 default">
          <Heart size={64} strokeWidth={2} />
        </Demo>
        <Demo label="size=64 absolute">
          <Heart size={64} strokeWidth={2} absoluteStrokeWidth />
        </Demo>
      </Section>

      <Section title="Reduced motion · toggle OS setting then refresh">
        <Demo label='reducedMotion="system"'><Heart size={36} /></Demo>
        <Demo label='reducedMotion="always"'>
          <Heart size={36} reducedMotion="always" />
        </Demo>
        <Demo label='reducedMotion="never"'>
          <Heart size={36} reducedMotion="never" />
        </Demo>
      </Section>
    </div>
  );
}

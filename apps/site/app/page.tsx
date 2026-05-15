"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { manifest } from "lucide-react-motion/manifest";
import * as Icons from "lucide-react-motion";
import type { DrawIconProps } from "lucide-react-motion";
import { IconCell } from "@/components/icon-cell";
import { ICON_COUNT, siteConfig } from "@/lib/site-config";

const ICON_COUNT_FORMATTED = ICON_COUNT.toLocaleString();
const GITHUB_URL = `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`;

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;
const IconMap = Icons as unknown as Record<string, IconComponent | undefined>;

const PAGE_SIZE = 96;

export default function Gallery() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? manifest.filter((m) => m.name.includes(q)) : manifest;
  }, [query]);

  const visible = filtered.slice(0, limit);

  return (
    <div
      className="min-h-screen bg-background font-mono text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-10">
      {/* Header — eyebrow / wordmark / tagline */}
      <header className="space-y-5 border-b border-border pb-10">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Open Source · ISC</span>
          <span>{manifest.length.toLocaleString()} icons</span>
        </div>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Lucide
          <span className="text-primary">{"//"}</span>
          Motion
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every Lucide icon, animated. A drop-in replacement for{" "}
          <code className="border border-border bg-secondary px-1.5 py-0.5 text-[0.85em]">
            lucide-react
          </code>{" "}
          with hover-to-draw motion, full prop parity, and a low-level escape
          hatch for custom variants. Editable React components, generated from
          source.
        </p>
        <div className="flex gap-3 pt-1">
          <Link
            href="/docs"
            className="border border-foreground bg-foreground px-4 py-2 text-xs uppercase tracking-[0.12em] text-background transition-colors hover:bg-primary hover:border-primary hover:text-primary-foreground"
          >
            Read the docs
          </Link>
          <Link
            href="/playground"
            className="border border-foreground px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
          >
            Playground
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="border border-foreground px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Sticky control bar — search */}
      <div className="sticky top-0 z-10 -mx-6 mt-8 border-b border-border bg-background/90 px-6 py-4 backdrop-blur sm:-mx-10 sm:px-10">
        <label className="flex items-center gap-2 border border-foreground bg-background px-3 py-2 text-sm focus-within:border-primary">
          <span className="text-muted-foreground">/</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder={`search ${ICON_COUNT_FORMATTED} icons...`}
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {/* Grid */}
      <div className="mt-12 space-y-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {query ? `${filtered.length} matches for "${query}"` : "All icons · hover any to draw it on"}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            no icons match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-4 border-l border-t border-border sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
            {visible.map((m) => {
              const Icon = IconMap[m.component];
              if (!Icon) return null;
              return <IconCell key={m.name} name={m.name} Icon={Icon} />;
            })}
          </div>
        )}

        {limit < filtered.length && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="border border-foreground px-5 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
            >
              Load more ({filtered.length - limit} left)
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Built on Lucide (ISC) · Animated with Motion</span>
        <span>
          <a
            href="https://lucide.dev"
            className="underline-offset-4 hover:text-primary hover:underline"
          >
            lucide.dev
          </a>
          {" · "}
          <code>bun run generate</code>
        </span>
      </footer>
      </div>
    </div>
  );
}

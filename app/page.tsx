"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import manifest from "@/src/generated/manifest.json";
import * as Icons from "@/src/generated";
import type { DrawIconProps } from "@/src/engine";
import { IconCell } from "@/components/icon-cell";
import { Playground } from "@/components/playground";

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
    <div className="editorial min-h-screen">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-10">
      {/* Header — eyebrow / wordmark / tagline */}
      <header className="space-y-5 border-b border-line pb-10">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <span>Open Source · ISC</span>
          <span>{manifest.length.toLocaleString()} icons</span>
        </div>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Lucide
          <span className="text-accent">{"//"}</span>
          Motion
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
          Every Lucide icon, animated. A drop-in replacement for{" "}
          <code className="border border-line bg-paper-dim px-1.5 py-0.5 text-[0.85em]">
            lucide-react
          </code>{" "}
          with hover-to-draw motion, full prop parity, and a low-level escape
          hatch for custom variants. Editable React components, generated from
          source.
        </p>
        <div className="flex gap-3 pt-1">
          <Link
            href="/docs"
            className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.12em] text-paper transition-colors hover:bg-accent hover:border-accent"
          >
            Read the docs
          </Link>
          <a
            href="https://github.com"
            className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Sticky control bar — search */}
      <div className="sticky top-0 z-10 -mx-6 mt-8 border-b border-line bg-paper/90 px-6 py-4 backdrop-blur sm:-mx-10 sm:px-10">
        <label className="flex items-center gap-2 border border-ink bg-paper px-3 py-2 text-sm focus-within:border-accent">
          <span className="text-ink-soft">/</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="search 1,711 icons..."
            className="w-full bg-transparent outline-none placeholder:text-ink-soft"
          />
        </label>
      </div>

      {/* Playground — every feature, hover-able */}
      <div className="mt-10">
        <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          Playground · live feature reference
        </div>
        <Playground />
      </div>

      {/* Grid */}
      <div className="mt-12 space-y-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          {query ? `${filtered.length} matches for "${query}"` : "All icons · hover any to draw it on"}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-line px-6 py-12 text-center text-sm text-ink-soft">
            no icons match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-4 border-l border-t border-line sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
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
              className="border border-ink px-5 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
            >
              Load more ({filtered.length - limit} left)
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>Built on Lucide (ISC) · Animated with Motion</span>
        <span>
          <a
            href="https://lucide.dev"
            className="underline-offset-4 hover:text-accent hover:underline"
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

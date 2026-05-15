import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import * as Icons from "@/src/generated";
import iconNodes from "lucide-static/icon-nodes.json";
import type { DrawIconProps, IconNode } from "@/src/engine";
import { CopyLine } from "@/components/icon-detail/copy-line";
import { IconHero } from "@/components/icon-detail/icon-hero";
import { TimingPresets } from "@/components/icon-detail/timing-presets";
import { getAllSlugs, getIcon } from "@/lib/icon-data";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;
const IconMap = Icons as unknown as Record<string, IconComponent | undefined>;
const nodesByName = iconNodes as unknown as Record<string, IconNode[] | undefined>;

export function generateStaticParams() {
  return getAllSlugs().map((name) => ({ name }));
}

export async function generateMetadata(
  props: PageProps<"/icons/[name]">
): Promise<Metadata> {
  const { name } = await props.params;
  const icon = getIcon(name);
  if (!icon) return {};
  return {
    title: `${icon.name} — Lucide//Motion`,
    description: `Animated React component for the Lucide "${icon.name}" icon. Drop-in replacement for lucide-react with hover-to-draw motion.`,
  };
}

export default async function IconPage(props: PageProps<"/icons/[name]">) {
  const { name } = await props.params;
  const icon = getIcon(name);
  if (!icon) notFound();

  const Icon = IconMap[icon.component];
  const nodes = nodesByName[icon.name];
  if (!Icon || !nodes) notFound();

  return (
    <div
      className="min-h-screen bg-background font-mono text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10">
        {/* Breadcrumb */}
        <nav className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <Link
            href="/"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            Gallery
          </Link>
          {" · "}
          <span>{icon.name}</span>
        </nav>

        {/* Header */}
        <header className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">{icon.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Animated React component — <code>{icon.component}</code> /{" "}
              <code>{icon.component}Icon</code>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://lucide.dev/icons/${icon.name}`}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
            >
              View on Lucide ↗
            </a>
            <a
              href={`https://github.com/lucide-icons/lucide/blob/main/icons/${icon.name}.svg`}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
            >
              Source ↗
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10">
          <IconHero Icon={Icon} name={icon.name} />
        </section>

        {/* Imports */}
        <section className="mt-10 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Import
          </div>
          <CopyLine
            value={`import { ${icon.component} } from "lucide-react-motion";`}
          />
          <CopyLine
            value={`import { ${icon.component}Icon } from "lucide-react-motion";`}
            label="alias (Lucide-suffix convention)"
          />
        </section>

        {/* Quick start */}
        <section className="mt-10 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Quick start
          </div>
          <div className="flex flex-wrap items-center gap-6 border border-border bg-background/40 p-6">
            <pre className="flex-1 overflow-x-auto text-xs">
              <code>{`import { ${icon.component} } from "lucide-react-motion";

<${icon.component} size={32} />`}</code>
            </pre>
            <div className="flex items-center justify-center border-l border-border pl-6">
              <Icon size={32} />
            </div>
          </div>
        </section>

        {/* Timing presets */}
        <section className="mt-12 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Timing presets · hover to play
          </div>
          <TimingPresets Icon={Icon} />
        </section>

        {/* Tags */}
        {icon.tags.length > 0 && (
          <section className="mt-12 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {icon.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {icon.related.length > 0 && (
          <section className="mt-12 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Related icons
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {icon.related.map((rel) => {
                const RelatedIcon = IconMap[rel.component];
                if (!RelatedIcon) return null;
                return (
                  <Link
                    key={rel.name}
                    href={`/icons/${rel.name}`}
                    className="flex aspect-square flex-col items-center justify-between gap-1.5 border border-border bg-background/40 px-3 py-4 text-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
                  >
                    <span className="flex flex-1 items-center justify-center">
                      <RelatedIcon size={24} strokeWidth={1.75} />
                    </span>
                    <span className="block w-full truncate text-center text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                      {rel.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Raw node data */}
        <section className="mt-12 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Raw node data
          </div>
          <details className="border border-border bg-background/40">
            <summary className="cursor-pointer px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
              IconNode[] (build-your-own)
            </summary>
            <pre className="overflow-x-auto border-t border-border bg-secondary/40 px-4 py-3 text-[11px] leading-relaxed">
              <code>{JSON.stringify(nodes, null, 2)}</code>
            </pre>
          </details>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Link
            href="/"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            ← Back to gallery
          </Link>
          <a
            href={`https://lucide.dev/icons/${icon.name}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            lucide.dev/icons/{icon.name} ↗
          </a>
        </footer>
      </div>
    </div>
  );
}

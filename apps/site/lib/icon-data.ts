/**
 * Helpers for the per-icon detail page. Static data only — every lookup is
 * resolved at build time when used inside `generateStaticParams` /
 * `generateMetadata` / server components.
 */

import { manifest, type ManifestEntry } from "lucide-react-motion/manifest";

export interface IconEntry {
  name: string;
  component: string;
}

interface IconDetail extends IconEntry {
  tags: readonly string[];
  related: IconEntry[];
}

const byName = new Map<string, ManifestEntry>(manifest.map((m) => [m.name, m]));

/** All icon slugs. Used by `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return manifest.map((m) => m.name);
}

/** Lookup by URL slug. Returns null if no such icon. */
export function getIcon(slug: string): IconDetail | null {
  const entry = byName.get(slug);
  if (!entry) return null;
  return {
    name: entry.name,
    component: entry.component,
    tags: entry.tags,
    related: getRelated(slug, entry.tags, 10),
  };
}

/**
 * Other icons that share the most tags with `slug`, sorted by overlap count.
 * Excludes the icon itself.
 */
function getRelated(slug: string, ownTags: readonly string[], limit: number): IconEntry[] {
  if (ownTags.length === 0) return [];
  const own = new Set(ownTags);
  const scored: Array<{ entry: IconEntry; overlap: number }> = [];

  for (const m of manifest) {
    if (m.name === slug) continue;
    if (m.tags.length === 0) continue;
    let overlap = 0;
    for (const t of m.tags) if (own.has(t)) overlap++;
    if (overlap > 0) scored.push({ entry: { name: m.name, component: m.component }, overlap });
  }

  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, limit).map((s) => s.entry);
}

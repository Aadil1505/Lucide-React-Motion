"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

const LINKS = [
  { label: "Gallery", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Docs", href: "/docs" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/icons");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  // Docs has its own Fumadocs nav with full feature set (search, sidebar toggle,
  // theme switch). Hiding our nav there avoids a stacked double bar.
  if (pathname.startsWith("/docs")) return null;

  const { owner, repo } = siteConfig.github;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 px-6 py-3 sm:px-10">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight whitespace-nowrap"
        >
          Lucide<span className="text-primary">{"//"}</span>Motion
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors sm:px-3",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="ml-1 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground sm:ml-2 sm:px-3"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

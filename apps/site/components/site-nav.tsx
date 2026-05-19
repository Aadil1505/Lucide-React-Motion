"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, NpmIcon } from "./brand-icons";

const LINKS = [
  { label: "Gallery", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Docs", href: "/docs" },
] as const;

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/icons");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the mobile sheet on route change. Done during render (not in an
  // effect) so React batches it into the same commit — avoids the extra
  // render the effect-based version would cause on every navigation.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Docs has its own Fumadocs nav with full feature set (search, sidebar toggle,
  // theme switch). Hiding our nav there avoids a stacked double bar.
  if (pathname.startsWith("/docs")) return null;

  const { owner, repo } = siteConfig.github;
  const githubUrl = `https://github.com/${owner}/${repo}`;
  const npmUrl = "https://www.npmjs.com/package/lucide-react-motion";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 px-6 py-3 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight whitespace-nowrap"
        >
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={20}
            height={20}
            priority
            className="size-5"
          />
          Lucide React Motion
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex sm:gap-2">
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
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="ml-1 inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:ml-2"
          >
            <GitHubIcon />
          </a>
          <a
            href={npmUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="npm package"
            className="ml-1 inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-[#cb3837] sm:ml-2"
          >
            <NpmIcon />
          </a>
          <AnimatedThemeToggler className="ml-1 inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:ml-2 [&_svg]:size-4" />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-1 sm:hidden">
          <AnimatedThemeToggler className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-l border-border bg-background font-mono"
            >
              <SheetHeader className="border-b border-border">
                <SheetTitle className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
                  <Image
                    src="/web-app-manifest-192x192.png"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  Lucide React Motion
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 px-4 py-4">
                {LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "border-b border-border/60 px-1 py-3 text-xs uppercase tracking-[0.14em] transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-border px-4 py-4">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHubIcon className="size-4" />
                  GitHub
                </a>
                <a
                  href={npmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-[#cb3837]"
                >
                  <NpmIcon className="size-4" />
                  npm
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

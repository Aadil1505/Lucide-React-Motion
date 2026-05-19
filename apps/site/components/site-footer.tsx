"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, NpmIcon } from "./brand-icons";

const NAV_LINKS = [
  { title: "Gallery", href: "/" },
  { title: "Playground", href: "/playground" },
  { title: "Docs", href: "/docs" },
] as const;

const EXTERNAL_LINKS = [
  { title: "Lucide", href: "https://lucide.dev" },
  { title: "Motion", href: "https://motion.dev" },
] as const;

export function SiteFooter() {
  const pathname = usePathname() ?? "/";

  // Docs has its own fumadocs layout/footer; skip ours there.
  if (pathname.startsWith("/docs")) return null;

  const { owner, repo } = siteConfig.github;
  const githubUrl = `https://github.com/${owner}/${repo}`;
  const npmUrl = "https://www.npmjs.com/package/lucide-react-motion";

  return (
    <footer className="border-t border-border bg-background py-16 font-mono md:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Link
          href="/"
          aria-label="Lucide React Motion home"
          className="mx-auto flex w-fit flex-col items-center gap-2"
        >
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={48}
            height={48}
            className="size-10"
          />
          <span className="text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              {link.title}
            </Link>
          ))}
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-5" />
          </a>
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="npm package"
            className="block text-muted-foreground transition-colors hover:text-[#cb3837]"
          >
            <NpmIcon className="size-5" />
          </a>
        </div>

        <span className="block text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} · Built on Lucide (ISC)
        </span>
      </div>
    </footer>
  );
}

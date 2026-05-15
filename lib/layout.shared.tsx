import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { siteConfig } from "@/lib/site-config";

export function baseOptions(): BaseLayoutProps {
  const { owner, repo } = siteConfig.github;
  return {
    nav: {
      title: (
        <span className="font-mono font-semibold tracking-tight">
          Lucide<span className="text-primary">{"//"}</span>Motion
        </span>
      ),
    },
    links: [
      { text: "Gallery", url: "/" },
      { text: "Docs", url: "/docs" },
    ],
    githubUrl: `https://github.com/${owner}/${repo}`,
  };
}

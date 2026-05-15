import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-mono font-semibold tracking-tight">
          Lucide<span className="text-accent">{"//"}</span>Motion
        </span>
      ),
    },
    links: [
      { text: "Gallery", url: "/" },
      { text: "Docs", url: "/docs" },
    ],
  };
}

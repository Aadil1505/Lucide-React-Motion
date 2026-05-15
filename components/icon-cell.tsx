import Link from "next/link";
import type { ComponentType } from "react";
import type { DrawIconProps } from "@/src/engine";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;

interface IconCellProps {
  name: string;
  Icon: IconComponent;
}

/**
 * A single tile in the gallery. Clicking the tile navigates to that icon's
 * detail page at `/icons/{name}`.
 */
export function IconCell({ name, Icon }: IconCellProps) {
  return (
    <Link
      href={`/icons/${name}`}
      title={`${name} — view details`}
      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-between gap-2 border-b border-r border-border bg-transparent px-3 py-5 text-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
    >
      <span className="flex flex-1 items-center justify-center">
        <Icon size={36} strokeWidth={1.75} />
      </span>
      <span className="block w-full truncate text-center text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-foreground">
        {name}
      </span>
    </Link>
  );
}

<p align="center">
  <img src="apps/site/public/web-app-manifest-192x192.png" alt="lucide-react-motion" width="120" height="120" />
</p>

<h1 align="center">Lucide React Motion</h1>

[![npm version](https://img.shields.io/npm/v/lucide-react-motion.svg?style=flat-square)](https://www.npmjs.com/package/lucide-react-motion)
[![license](https://img.shields.io/npm/l/lucide-react-motion.svg?style=flat-square)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/lucide-react-motion?style=flat-square)](https://bundlephobia.com/package/lucide-react-motion)
[![types](https://img.shields.io/npm/types/lucide-react-motion?style=flat-square)](https://www.npmjs.com/package/lucide-react-motion)

Every Lucide icon, animated. A drop-in replacement for [`lucide-react`](https://lucide.dev/guide/packages/lucide-react) with hover-to-draw motion, full prop parity, and a low-level escape hatch for custom variants. Powered by [Motion](https://motion.dev).

→ **Docs, gallery, playground:** [lucide-react-motion-site.vercel.app](https://lucide-react-motion-site.vercel.app)
→ **npm:** [`lucide-react-motion`](https://www.npmjs.com/package/lucide-react-motion)

```tsx
import { Heart } from "lucide-react-motion";

export default function Like() {
  return <Heart trigger="hover" size={32} />;
}
```

---

## Features

- **1,700+ icons** — every Lucide icon exported as a React component.
- **Drop-in for `lucide-react`** — identical prop surface (`size`, `color`, `strokeWidth`, `absoluteStrokeWidth`, `className`, refs).
- **Triggers** — `hover`, `parent-hover`, `in-view`, `mount`, `manual`. Imperative `play()` / `reset()` via ref.
- **Modes** — `"draw"`, `"pulse"`, `"spin"`, `"shake"`, `"bounce"`, plus per-icon `"signature"` animations (heart beats, bell rings, loader spins forever).
- **Leave behavior** — `complete`, `snap`, `redraw`. Pick what happens when hover ends.
- **App-wide defaults** — wrap a subtree in `<MotionIconConfig>` and override duration, easing, trigger, etc.
- **Custom motion** — pass your own `variants` to bypass the built-in draw and animate anything Motion can.
- **RSC-safe** — components are client by default; library is `sideEffects: false` and tree-shakeable.
- **Dual ESM/CJS**, full TypeScript types, ships with provenance.
- **Respects `prefers-reduced-motion`** out of the box.

## Install

```bash
npm  install lucide-react-motion motion
pnpm add     lucide-react-motion motion
yarn add     lucide-react-motion motion
bun  add     lucide-react-motion motion
```

`motion`, `react`, and `react-dom` are peer dependencies (`motion >= 11`, React 18 or 19).

## Quick start

```tsx
import { Heart, Bell, Search } from "lucide-react-motion";

export function Toolbar() {
  return (
    <div className="flex gap-3 text-zinc-700">
      <Heart  trigger="hover" />
      <Bell   trigger="mount" />
      <Search trigger="in-view" />
    </div>
  );
}
```

Color is `currentColor` by default, so Tailwind text utilities work directly:

```tsx
<Heart className="text-rose-500 hover:text-rose-600 transition-colors" />
```

For the full API — triggers, leave modes, custom variants, manual control — see [lucide-react-motion-site.vercel.app/docs](https://lucide-react-motion-site.vercel.app/docs).

---

## Repo layout

This is a pnpm + Turborepo monorepo.

```
packages/
  lucide-react-motion/   The published library (tsup, dual ESM/CJS, RSC-safe)
    src/
      engine.tsx           Core <DrawIcon /> + provider + trigger plumbing
      generated/           1,700+ icon components (codegen output, gitignored)
      manifest.ts          Generated icon catalog: { name, component, tags: readonly string[] }
    scripts/generate.ts    Codegen from lucide-static
    tsup.config.ts         Two-pass build: main bundle + /manifest subpath
apps/
  site/                  Docs, gallery, playground (Next.js + Fumadocs)
```

The site imports the library by package name via `workspace:*`, so every example shown in the docs is the same code an npm consumer writes.

## Development

### Prerequisites

- **Node 20+** (`engines.node` declares `>=18`; the workspace is tested on 20).
- **pnpm 10** — install with `corepack enable && corepack prepare pnpm@10 --activate`, or `npm i -g pnpm`.

### Clone and bootstrap

```bash
git clone https://github.com/Aadil1505/Lucide-React-Motion.git
cd Lucide-React-Motion
pnpm install
pnpm dev
```

`pnpm dev` runs the library in watch mode (`tsup --watch`) and the docs site (`next dev`) in parallel via Turborepo. The site auto-reloads when library source changes.

- Site: http://localhost:3000
- Library output: `packages/lucide-react-motion/dist/`

### Scripts

Root (run from repo root, fans out via Turborepo):

| Script                   | What it does                                                                  |
| ------------------------ | ----------------------------------------------------------------------------- |
| `pnpm dev`               | Library `--watch` + site `next dev` (parallel, persistent, not cached)        |
| `pnpm build`             | Build every package. Honors `dependsOn: ["^build"]` — lib builds before site. |
| `pnpm typecheck`         | `tsc --noEmit` across all packages                                            |
| `pnpm lint`              | ESLint across all packages                                                    |
| `pnpm changeset`         | Author a changeset for the next release                                       |
| `pnpm version-packages`  | Apply pending changesets locally (bumps versions + updates changelogs)        |
| `pnpm release`           | Build the lib, then `changeset publish`. Used by CI; you shouldn't run it locally unless you know what you're doing. |

Library workspace (`packages/lucide-react-motion`):

| Script                                                  | What it does                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm --filter lucide-react-motion generate`            | Regenerate `src/generated/` + `manifest.ts` from `lucide-static` |
| `pnpm --filter lucide-react-motion build`               | Two-pass tsup build (main bundle + `/manifest` subpath); runs `generate` first |
| `pnpm --filter lucide-react-motion dev`                 | `tsup --watch --no-dts` (skips type emit for faster reloads) |
| `pnpm --filter lucide-react-motion typecheck`           | `tsc --noEmit`                                               |
| `pnpm --filter lucide-react-motion clean`               | Remove `dist/` and `src/generated/`                          |

Site workspace (`apps/site`):

| Script                          | What it does                                  |
| ------------------------------- | --------------------------------------------- |
| `pnpm --filter site dev`        | `next dev` only (no library watch — use `pnpm dev` from root for the full loop) |
| `pnpm --filter site build`      | Production `next build`. Lib must be built first (Turborepo handles this from root). |
| `pnpm --filter site start`      | Serve the built site (`next start`)           |
| `pnpm --filter site lint`       | `eslint`                                      |
| `pnpm --filter site typecheck`  | `tsc --noEmit`                                |

### Validating the published package

Before cutting a release, the library is checked against:

```bash
pnpm dlx publint packages/lucide-react-motion
pnpm dlx @arethetypeswrong/cli --pack packages/lucide-react-motion --ignore-rules no-resolution
```

`publint` catches `package.json` issues (missing `types`, wrong `main`, broken `exports`). `arethetypeswrong` verifies the type entry resolves under every module system. CI runs both on every push and PR (`.github/workflows/ci.yml`).

The `no-resolution` rule is intentionally ignored — the `/manifest` subpath export is unresolvable on Node 10, which we don't support (`engines.node >=18`).

### Workspace + dependency management

- **Catalog versions.** Shared deps (`react`, `react-dom`, `motion`, `typescript`, `@types/*`) are pinned in `pnpm-workspace.yaml` under `catalog:`. Reference them with `"react": "catalog:"` in workspace `package.json`s. Bump once in `pnpm-workspace.yaml`, run `pnpm install`, every workspace picks it up.
- **Cross-workspace linking.** The site depends on the library via `"lucide-react-motion": "workspace:*"`. pnpm replaces this with the actual version at publish time.
- **Strict postinstall.** `pnpm-workspace.yaml` `onlyBuiltDependencies` allowlists which packages may run install scripts (`esbuild`, `sharp`, `unrs-resolver`). Anything else is skipped — pnpm's supply-chain default. If a new dep needs an install script, add it explicitly.
- **Frozen lockfile in CI.** CI uses `pnpm install --frozen-lockfile`. Always commit `pnpm-lock.yaml` changes alongside dependency edits.

### Turborepo caching

`turbo.json` caches `build` and `typecheck` outputs (`dist/**`, `.next/**` excluding `.next/cache/**`). Re-running an unchanged build is a near-instant cache hit. To force a clean run:

```bash
pnpm turbo run build --force
```

For remote caching across machines/CI, sign in once with `pnpm turbo login && pnpm turbo link`.

### Continuous integration

Two workflows live under `.github/workflows/`:

- **`ci.yml`** — runs on every push and PR to `main`. Installs with a frozen lockfile, builds, typechecks, lints, then validates the library tarball with `publint` and `arethetypeswrong`.
- **`release.yml`** — runs on push to `main`. Uses `changesets/action` to either open a "Version Packages" PR (when unreleased changesets exist) or publish to npm (after the version PR is merged).

### Troubleshooting

- **`Module not found: lucide-react-motion/...` in the site after a fresh clone.** Run `pnpm --filter lucide-react-motion build` once — the site needs `dist/` to exist. `pnpm dev` from the root handles this automatically.
- **Icons missing or stale after a Lucide bump.** Delete and regenerate: `pnpm --filter lucide-react-motion clean && pnpm --filter lucide-react-motion generate`.
- **`ERR_PNPM_BAD_PM_VERSION`.** Your pnpm is older than the `packageManager` pin (`pnpm@10.12.1`). Run `corepack prepare pnpm@10 --activate`.
- **Turborepo cache lying about a real failure.** `pnpm turbo run build --force` bypasses the cache.

### Adding or updating icons

Per-icon component files in `packages/lucide-react-motion/src/generated/` are **codegen output and gitignored**. They're regenerated from [`lucide-static`](https://www.npmjs.com/package/lucide-static) before every build and dev run.

To pull in new icons, bump `lucide-static` and regenerate:

```bash
pnpm --filter lucide-react-motion up lucide-static
pnpm --filter lucide-react-motion generate
```

The generator (`packages/lucide-react-motion/scripts/generate.ts`) writes:
- one component file per icon under `src/generated/`
- a `manifest.ts` cataloging every icon (name, component, tags)
- the barrel `index.ts` re-exports

### Editing the engine

`packages/lucide-react-motion/src/engine.tsx` is hand-written. It owns:
- `<DrawIcon />` — the core SVG renderer every generated component wraps
- `<MotionIconConfig />` — app-wide defaults provider
- Trigger plumbing (`hover`, `parent-hover`, `in-view`, `mount`, `manual`)
- Leave behavior (`complete` / `snap` / `redraw`)
- The default draw variants

Changes here affect every icon; prefer adding props with safe defaults over breaking existing behavior.

### Testing changes against a fresh consumer

The site uses `workspace:*` so it doesn't catch packaging bugs (missing exports, broken `dist` shape). Before releasing, smoke-test against a fresh app:

```bash
pnpm --filter lucide-react-motion build
cd /tmp && npx create-next-app@latest smoke --ts --no-tailwind --app
cd smoke
npm install /absolute/path/to/Lucide-React-Motion/packages/lucide-react-motion
# import { Heart } from "lucide-react-motion"; ...
npm run dev
```

## Release

Versioning and publishing go through [Changesets](https://github.com/changesets/changesets).

1. Author a changeset describing your change and the semver bump:
   ```bash
   pnpm changeset
   ```
2. Commit the generated `.changeset/*.md` file with your PR.
3. On merge to `main`, the **Release** GitHub Action opens a "Version Packages" PR that bumps versions and updates changelogs.
4. Merging that PR publishes `lucide-react-motion` to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements).

The `site` app is private and never published.

Publishing requires either an `NPM_TOKEN` repo secret or (preferred) npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) configured against `.github/workflows/release.yml`.

## Contributing

Issues and PRs welcome at [github.com/Aadil1505/Lucide-React-Motion](https://github.com/Aadil1505/Lucide-React-Motion). Before opening a PR:

1. Run `pnpm typecheck` and `pnpm lint`.
2. If the change is user-visible, add a changeset (`pnpm changeset`).
3. Keep the public API of `lucide-react-motion` backwards compatible unless the change is intentionally breaking — flag it on the changeset.

## Contributors

- [**Aadil Alli**](https://github.com/Aadil1505) — author, maintainer
- [**Mani Tofigh**](https://github.com/manitofigh) — contributor

PRs welcome — see [Contributing](#contributing).

## License

[MIT](./LICENSE) © Aadil Alli

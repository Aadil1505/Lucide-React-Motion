# lucide-react-motion

Lucide icons as animated React components, powered by [Motion](https://motion.dev). Every one of Lucide's 1,700+ icons exported as a React component that draws itself on hover, mount, scroll, or imperative call.

```tsx
import { Heart } from "lucide-react-motion";

<Heart trigger="hover" size={32} />
```

→ Docs, gallery, and playground: **[lucide-react-motion.dev](https://lucide-react-motion.dev)**
→ npm: **[lucide-react-motion](https://www.npmjs.com/package/lucide-react-motion)**

## Repo layout

This is a pnpm + Turborepo monorepo.

```
packages/
  lucide-react-motion/   the published library (tsup, dual ESM/CJS, RSC-safe)
apps/
  site/                  the docs + gallery + playground (Next.js + Fumadocs)
```

The site imports the library by package name via `workspace:*`, so every example shown in the docs is the same code an npm consumer would write.

## Develop

Requires **Node 20+** and **pnpm 10**.

```bash
pnpm install
pnpm dev          # runs lib (tsup --watch) + site (next dev) in parallel
```

Other useful scripts:

```bash
pnpm build                              # build everything
pnpm typecheck                          # tsc across all packages
pnpm lint                               # eslint across all packages
pnpm --filter lucide-react-motion build # build only the library
pnpm --filter site dev                  # run only the site
```

### Adding or updating icons

The 1,700+ per-icon component files in `packages/lucide-react-motion/src/generated/` are codegen output, not checked into git. Bump `lucide-static` and rerun the generator:

```bash
pnpm --filter lucide-react-motion generate
```

This happens automatically before `build` and `dev`.

## Release

Versioning and publishing go through [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset           # describe your change, pick a bump
git commit -am "..."
```

On merge to `main`, the **Release** GitHub Action opens a "Version Packages" PR. Merging that PR publishes `lucide-react-motion` to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements). The `site` app is private and never published.

A repo secret `NPM_TOKEN` must be configured for the release workflow.

## License

MIT

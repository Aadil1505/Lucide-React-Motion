---
name: lucide-signature
description: Author the next high-priority pending Lucide signature family for the lucide-react-motion library. Use when the user says "work on the next family", "continue signatures", "next signature family", "do the next family", "/signature", or otherwise asks Claude to extend signature coverage. Auto-detects what's next by running `pnpm --filter lucide-react-motion status --json` and cross-referencing the section 7 priority list in `docs/signatures.md`. Falls back to one-off decorative icons after all priority families are done. Follows the project's signature authoring guide end-to-end — three principles (real-life physics, cohesion, within-bounds), two-tier rule, host-keyframes coupling pattern, full validation checklist.
---

# Lucide signature authoring workflow

You're authoring the next pending signature family for `lucide-react-motion`. The user did not specify which family — you pick the highest-priority one with pending icons. Be explicit with the user about what you picked and why, then proceed.

## Step 1 — Read the authoring guide

Before anything else, read `docs/signatures.md` end-to-end. It's the source of truth. The three principles in section 1 govern every motion you write:

1. **Real-life physics first — bespoke per object.** Each motion must mimic how *this specific real-world thing* actually behaves. **Never default to a generic pulse / shake / spin / scale to make an icon "feel alive."** A flame flickers in HEIGHT not width; a heart contracts inward during systole, not outward; sound waves radiate from their source, not from the icon centre; a moon reflects light (opacity only) rather than emitting it (no radial scale); a clock's hands tick clockwise in discrete steps, not smooth sweeps. If you're tempted to "just rotate the whole icon" or "just add a uniform scale pulse," stop and design what the real-life referent actually does instead.
2. **Cohesion — every path tracks the host.** Both Tier 1 markers AND Tier 2 physical elements inherit the host's primary transform via `inherit: true` per-value transitions.
3. **Stay within the 24×24 viewBox.** Scale-based motion should be a contraction (`scale ≤ 1`), not an expansion — anatomically more accurate for most icons AND keeps the stroke inside the SVG (which defaults to `overflow: hidden`). Remember the scaled-stroke gotcha: `transform: scale(1.2)` also scales the strokeWidth by 1.2, so a path's visible edge is `scaled_endpoint + scaled_stroke_radius`, not just the scaled endpoint.

### Read the bell family first — it is the canonical template

Before reading any other family, read the bell family motions end-to-end. **Bell is the template every other family is shaped against.** It covers, in one place, every structural pattern you will need to write a new family. When you start a new family with state-modifier variants (`-off`, `-plus`, `-minus`, `-check`, `-dot`), copy bell's layout first and adapt the physics.

- `motions/bell-shell.ts` — the host motion. Specific path match via `matchPathDOneOf` over a registry (Lucide reshapes the shell across variants — every shape goes in the registry). Exports `BELL_SHELL_KEYFRAMES` so other family motions can inherit the rock.
- `motions/bell-clapper.ts` — a second physical element inside the host with its own physics (free pendulum inside the rocking shell), coupled to the shell's rhythm via inherited keyframes.
- `motions/bell-sound-waves.ts` — Tier 2 emitted physical elements (the radiating arcs). Bespoke draw-in physics + host-rotation inheritance for cohesion.
- `motions/bell-modifier-reveal.ts` — **the family wildcard for state modifiers** (slash for `bell-off`, plus / minus / check stroke markers in `bell-plus` / `bell-minus` / `bell-check`). `matchAnyPath` placed LAST in the compose list, `pathLength` + `opacity` draw-in plus inherited host rotation. Copy this shape whenever a new family needs `-off` / `-plus` / `-minus` / `-check` variants.
- `motions/bell-dot-reveal.ts` — the geometric-marker counterpart of the family wildcard, for `<circle>` modifiers (the notification dot in `bell-dot`). Same shape as the wildcard but matches by `cx` / `cy` / `r` and uses `scale` + `opacity` (no `pathLength` on circles).

`signatures/bell-off.ts` is the textbook composition order: `[bellClapper, bellShell, bellModifierReveal]` — specific physics first, family wildcard LAST. When you build a new family with state-modifier variants, mirror this layout exactly.

Then skim these for additional vocabulary:

- `motions/heart-beat.ts` + `motions/heart-modifier-reveal.ts` — bell template applied to a uniform-scale host (the registry is `HEART_PATHS`; the modifier-reveal inherits `scale` instead of `rotate`).
- `motions/flame-flicker.ts` — per-element-direction physics (scaleY contraction, base-anchored sway, brightness flicker — *not* a uniform scale).
- `motions/cloud-rain-drops.ts` vs `motions/cloud-snow-dots.ts` vs `motions/cloud-lightning-bolt.ts` — three different precipitation types, three different motions inside one family.
- `motions/moon-glow.ts` (opacity only — moon reflects) vs `motions/sun-ray-pulse.ts` (radial scale + opacity — sun emits).
- `motions/eye-blink.ts` + `motions/eye-modifier-reveal.ts` — bell template applied to an **axis-asymmetric** host (eye blink is `scaleY`-only). The modifier-reveal doesn't inherit `scaleY` directly (would flatten the slash) but synthesizes an in-plane uniform `scale` dip over the host's `times` so the slash shares a kinetic peak with the blink without distortion. See step 4's tier-1 markers note.

The host-coupling pattern (section 5's worked example) is mandatory for any family whose host transforms.

### Animate per path — one motion per anatomical part

Lucide draws each icon as a list of SVG paths/strokes, and Lucide chose to split them along the icon's anatomy: the clock face is one path, the hour-pair stroke is another; the bell shell is one path, the clapper is another; the cloud body is one path, each rain drop is its own. **Treat that path list as the icon's anatomy.** When the depicted object is made of parts that move differently in real life, you author a separate motion per part and match by path data — not one shared motion smeared across everything.

Worked examples that already shipped:

- **Bell** has shell (rocks on the mount, ~12°), clapper (free pendulum inside, ~22°), and sound waves (radiate outward from the mount). Three different paths, three different motions, three different physical behaviours — but they share a coupled rhythm via `BELL_SHELL_KEYFRAMES`.
- **Clock** has face (mostly steady, tiny breath) and a combined hand-pair (clockwise tick); composite variants add a modifier (alert / arrow / check / plus) that reveals separately. `clockFace` + `clockHands` + `clockModifierReveal` — three motions matched per path role.
- **Flame-kindling** has the flame teardrop (flicker, sway, brightness) AND the two crossed wood sticks (ember opacity glow, slight inherited sway). Two motions per role; the flame dances and the kindling glows independently.
- **Cloud-hail** has the cloud body (gentle breath), three bigger vertical hail pieces (draw-down via `cloudRainDrops`), and three round hailstones (contraction twinkle via `cloudSnowDots`). Three concurrent motions inside one icon.
- **Moon-star** has the crescent (opacity-only reflective glow) AND the small four-pointed sparkle (contraction twinkle pivoted at the star's own centre). Two motions, two different physics, two different transform origins of concern.

How to apply this in practice:

1. Open `src/generated/<icon>.tsx` and **enumerate the `nodes` array out loud** — every entry corresponds to one drawable stroke. Label each one by what it depicts (handle, canopy, slash, ray, sparkle, …).
2. For each anatomical role, decide its own physical motion. If two roles share the same physics (e.g. the upper and lower fragments of a split `cloud-off` body both want the cloud's gentle breath), one motion can cover both via a shared `d`-list matcher. If two roles need different physics, they get separate motion modules.
3. Match by **path data**, not index — `matchPathD`, `matchPathDOneOf`, a regex over `ctx.pathAttrs.d`, or geometric predicates over `ctx.pathTag` / `pathAttrs.cx` / `cy` / `r`. The path list is anatomy; the index list is incidental ordering.
4. If a path's role doesn't have a clear real-life motion (e.g. a decorative state marker), use the family's coupled modifier reveal. Whether it *directly* inherits the host transform depends on the host's transform shape — see step 4's tier-1 markers note (in-plane host transforms get inherited; axis-asymmetric host transforms get a synthesized in-plane companion instead, never direct inheritance and never fully rigid).

When in doubt, ask: "Could this anatomical part move independently of the rest of the icon in reality?" If yes, it deserves its own motion. If no (rigid sub-part of a larger piece), it can share its parent's motion. Either way, the decision happens at the **path level**, not the icon level.

### Anti-patterns — what NOT to do

These are mistakes prior attempts have made; the user has explicitly rejected them, and you must not repeat them:

- **"Use sunRotate / sunRayPulse / cloudBody / etc. for every variant in the family by default."** Lazy reuse of a family's wildcard motion for asymmetric variants reads as the wrong physics. (sun-moon's moon must glow, not rotate around the icon centre; sun-snow's snowflake must twinkle in place, not spin with the sun.) Design what *this specific composite icon* does in reality, then layer specific motions per element role.
- **"Generic pulse / shake / spin to make it feel alive."** These belong in the `mode="pulse"` / `mode="spin"` etc. generic modes for consumers who explicitly opt in. Signatures are about the icon's identity — every icon should have a motion that *only makes sense for that icon*. If you find yourself reaching for a uniform scale pulse, ask whether the real-world referent has a more specific behaviour (it almost always does).
- **"Scale up to make the motion punchier."** Per principle 3 and the scaled-stroke gotcha. The right answer is almost always contraction (`scale ≤ 1`), and the brightness/character comes from opacity dips or per-axis transforms (scaleY only, rotation pivoted at a meaningful point).
- **"Match by `ctx.index`."** Lucide reorders paths. Always match by `d` data (`matchPathD`, `matchPathDOneOf`, or a regex over `pathAttrs.d`) or by SVG element geometry (`pathTag` + `cx`/`cy`/`r` etc.).
- **"Use `matchAnyPath` as the only matcher in a multi-element signature."** It'll claim every path including ones that need bespoke physics. `matchAnyPath` belongs LAST in a compose list, only as a wildcard fallback.
- **"One motion for the whole icon when the icon has multiple moving parts."** If the icon depicts an object whose anatomical parts move differently in real life — clock face vs hands, bell shell vs clapper vs waves, flame vs kindling, cloud vs rain drops — you need one motion *per role* matched by path data, not one shared transform smeared across every path. See "Animate per path" above.
- **"Directly inherit an axis-asymmetric host transform on an overlay marker."** Bell / heart / cloud modifier-reveals inherit the host transform directly because the host moves in-plane (rotation / uniform scale). When the host moves axis-asymmetrically (eye blink's `scaleY` only), direct inheritance flattens the marker unnaturally — *but* going fully rigid (no kinetic life on the marker at all) is also wrong; it reads as a static line popping over a moving icon. Synthesize an in-plane companion (uniform `scale` dip, `opacity` dip) over the host's `times` so the marker shares a kinetic peak with the host without orientation distortion. See step 4's tier-1 markers note.

### Future feature you might be asked about

There's a deferred `intensity` prop planned — see project memory `project_intensity_prop.md`. It would multiply keyframe amplitudes toward rest so consumers can dial each icon's motion up or down. Don't implement it unless the user explicitly asks; just be aware it exists and that any motion you write today should expect to eventually be wrapped by `attenuate(rest, keyframes, intensity)`.

## Step 2 — Find the next family

Run the coverage report:

```bash
pnpm --filter lucide-react-motion status --json
```

Parse the JSON. You'll get `families[]` with `family`, `total`, `signed`, `pending`, `status` for each.

Pick the next target using this order:

1. **Partial families with 1–2 pending icons** that are listed in the section 7 priority roadmap — finish those first (less context-switching).
2. Otherwise, the highest-priority **partial** family from section 7's order.
3. Otherwise, the highest-priority **pending** family from section 7's order.
4. If all section-7 families are done, fall back to the **one-off decorative** icons listed in section 7's "Decorative / one-off" block (sparkle*, zap, atom, compass, gauge, wind, leaf, waves, …). Pick them one at a time.
5. **Skip** the explicit "Skip / defer" list (pure-text icons, abstract geometry, brand logos). Don't author signatures for those.

Section 7's priority order (high to low):

- `heart-*`
- `clock-*` (clock, alarm-clock, timer, watch, hourglass)
- `sun-*` / `moon-*`
- `cloud-*` + `droplet*`
- `flame*` / `fire`
- `loader-*` / `refresh-*` / `rotate-*`
- `wifi-*` / `signal-*` / `volume-*`
- `battery-*`
- `mail-*` / `send`
- `mic-*` / `mic-off`
- `arrow-*` / `chevron-*` / `move-*`
- `play` / `pause` / `stop` / media controls
- `search`

Then the decoratives.

**Announce your pick** to the user before starting:

> Picking the **`<family>`** family next — N pending icon(s): `a`, `b`, `c`. Status is currently `<partial|pending>` (M/N signed).

## Step 3 — Pre-flight check

Before writing any code:

- `git status` — if the working tree has uncommitted changes, ask the user whether to proceed (they may be mid-task on something else).
- Confirm the current branch — typically `feat/animation-modes` or wherever the user has been working. Don't switch branches without asking.
- Check user memory (`MEMORY.md`) for any relevant feedback notes — especially around commit conventions and phase review cadence.

## Step 4 — Author each variant

For every pending icon in the family, follow section 4 of the doc:

1. **Inspect the paths** — open `src/generated/<icon>.tsx`, note how many paths it has, what each one represents in the real-world referent.
2. **Decide tier per path** (section 3). Remember: tier only decides what *additional* motion the path gets — both tiers inherit the host's transform.
3. **Reuse existing motions** by path-data match. If a variant reshapes the host's `d` slightly, extend the host motion's `matchPathDOneOf` list rather than writing a new motion.
4. **Make sure the host motion exports its keyframe constants** (`HEART_BEAT_KEYFRAMES`, `BELL_SHELL_KEYFRAMES` are the precedent). Other family motions inherit them.
5. **Tier 1 markers** — use the family's coupled modifier reveal (`heartModifierReveal`, `bellModifierReveal`, etc.) as the template. If the family doesn't have one yet, build it: a `matchAnyPath` motion that combines `pathLength` + `opacity` reveal, placed LAST in the compose list. For circle markers, build a geometry-matched equivalent (`bellDotReveal`).

   Whether the marker *also* inherits the host's primary transform depends on the **shape** of that host transform:

   - **In-plane host transforms (rotation, uniform `scale`, translation)** — inherit via per-value `inherit: true` so the marker tracks the host. Slash rocks with the bell, slash scales with the heart, slash breathes with the cloud. Precedent: `bellModifierReveal` / `heartModifierReveal` / `cloudModifierReveal`.
   - **Axis-asymmetric host transforms (`scaleY` only, `scaleX` only)** — do NOT inherit the asymmetric transform directly (it flattens the marker — a diagonal slash inheriting a vertical-only squeeze collapses toward the horizontal axis and reads as the marker itself blinking). But the marker still needs continuous kinetic life timed to the host's apex, or it pops in as a static line over a moving icon and reads disconnected from the host motion. **Synthesize an in-plane companion** — a uniform `scale` dip (e.g. `[1, 0.85, 1]`) and/or an `opacity` dip — and pin it to the host's `times` so the marker shares a temporal peak with the host without orientation distortion. Time the `pathLength` strike to **complete at** the host's apex (not after it) so the draw-in and the host collapse share a single peak. Precedent: `eyeModifierReveal` (eye blinks via `scaleY` only; the slash strikes through with a uniform-scale companion timed to the blink apex via `EYE_BLINK_KEYFRAMES.times`, and the pathLength peaks at the same `0.5` mark as the blink).
6. **Tier 2 with bespoke physics** — write a new motion under `src/modes/motions/`, named `<icon>-<role>.ts`. Design it from "how does this real-world thing actually behave?". If it sits inside or attached to a transforming host, also inherit the host's keyframes via the same per-value pattern.
7. **Write the signature** as a thin `compose()` call (`src/modes/signatures/<icon>.ts`).
8. **Don't force motion on icons where `draw` is the right answer** — if a variant has no clear physical or semantic motion, skip its signature and let it fall back to draw.

After each phase of work, **self-review before moving on** (project memory `feedback_phase_review.md`): fix issues and re-review before the next phase.

## Step 5 — Validate (code-side)

```bash
pnpm --filter lucide-react-motion generate
pnpm typecheck
pnpm --filter lucide-react-motion test
```

All three must pass. If `pnpm typecheck` fails on the first run via turbo, retry once — the prebuild generate step can race with the typecheck task.

Trace every path of every variant through the compose order and confirm no path falls through to `draw` (no dev warnings expected at runtime).

## Step 6 — Section 8 checklist

Walk through `docs/signatures.md` section 8. Code-side items are yours to confirm. The visual items are for the user — list each variant out by name so they know what to hover in `/playground`.

## Step 7 — Commit on this branch

Per project memory (`feedback_commits.md`): **no Co-Authored-By trailer.** All commits attributed solely to the user.

Subject conventions (from recent commits): `feat(lib): <family> family signatures` for a new family, `fix(lib): ...` for a refinement of an existing one. Use a HEREDOC for the body to keep multi-line formatting intact.

Stage **only the source files** you touched — `src/generated/` is gitignored and regenerated on prebuild, so generated wrappers aren't part of the commit.

Update `docs/signatures.md`'s section-6 catalog table with rows for any new motion modules.

## Step 8 — Hand back for visual review

Report to the user:

- Commit hash + subject.
- New status (`pnpm --filter lucide-react-motion status`) so they see coverage progress.
- The list of variants to hover in `/playground` with `mode="signature"` at size 56 AND 120.
- What to look for: real-life motion reads correctly, every non-shell path tracks the host, no clipping at the edges, no static modifiers floating over moving icons.

**Do not start the next family without explicit user approval.** One family per invocation. The user reviews visually, requests adjustments if needed (those become a refinement fix commit), then approves moving on.

## Common pitfalls (from `docs/signatures.md` section 9 — re-read before submitting)

- **`inherit: true` is REQUIRED on every per-value transition.** Without it, motion-dom replaces the parent transition entirely, dropping `duration`/`delay`/`repeat` and falling back to its 300 ms default — the modifier ends up out of phase with the rest of the icon.
- **`scale > 1` clips at viewBox edges.** Design scale rhythms as contractions (`scale ≤ 1`). Real things squeeze when they pulse, they don't balloon.
- **Match paths by `d` data**, never by `ctx.index` — Lucide reorders paths sometimes.
- **`matchAnyPath` is greedy.** Always last in the compose `motions` list.
- **Regenerate after writing a signature.** The codegen reads `src/modes/signatures/` at generate-time; `prebuild` and `predev` handle it automatically, but you'll need to run it manually outside those flows.

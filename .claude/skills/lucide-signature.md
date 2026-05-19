---
name: lucide-signature
description: Author the next high-priority pending Lucide signature family for the lucide-react-motion library. Use this skill whenever the user says "work on the next family", "continue signatures", "next signature family", "do the next family", "/signature", or otherwise asks Claude to extend signature motion coverage — even when they don't name the file or path. Bell family (`bellShell` + `bellClapper` + `bellSoundWaves` + `bellModifierReveal` + `bellDotReveal`) is the canonical template every other family is shaped against. Auto-detects what's next by running `pnpm --filter lucide-react-motion status --json` and cross-referencing the section 7 priority list in `docs/signatures.md`. Falls back to one-off decorative icons after all priority families are done. Enforces the three-criteria check on every overlay marker — continuous kinetic life, non-distortion, apex alignment — so the agent doesn't ship partially-fixed motion.
---

# Lucide signature authoring workflow

You're authoring the next pending signature family for `lucide-react-motion`. The user did not specify which family — you pick the highest-priority one with pending icons. Be explicit with the user about what you picked and why, then proceed.

## Workflow at a glance

1. **Read the source-of-truth docs** — `docs/signatures.md` end-to-end + the bell family motions (≈10 min). Bell is the canonical template; mirror its layout when authoring a family with state-modifier variants.
2. **Pick the next family** — parse `pnpm --filter lucide-react-motion status --json` and apply the priority order from Step 2 below.
3. **Pre-flight** — `git status`, branch check, scan project memory.
4. **For each variant** — inspect the generated tsx, decide a motion per anatomical role, reuse or author motions, compose the signature.
5. **Run the three-criteria check** on every overlay marker (slash / plus / minus / check / dot) before declaring done — see step 4's check-list.
6. **Validate** — generate + typecheck + test must all pass.
7. **Commit** on the current branch (no Co-Authored-By trailer per project memory).
8. **Hand back** to the user for visual review — list variants + what to look for.

One family per invocation. Don't start the next one without explicit user approval.

## Step 1 — Read the authoring guide

Before anything else, read `docs/signatures.md` end-to-end. It's the source of truth. The three principles in section 1 govern every motion you write:

1. **Real-life physics first — bespoke per object.** Each motion must mimic how *this specific real-world thing* actually behaves. **Never default to a generic pulse / shake / spin / scale to make an icon "feel alive."** A flame flickers in HEIGHT not width; a heart contracts inward during systole, not outward; sound waves radiate from their source, not from the icon centre; a moon reflects light (opacity only) rather than emitting it (no radial scale); a clock's hands tick clockwise in discrete steps, not smooth sweeps. If you're tempted to "just rotate the whole icon" or "just add a uniform scale pulse," stop and design what the real-life referent actually does instead.
2. **Cohesion — every non-shell path shares kinetic life with the host.** A modifier or attached element sitting statically over a moving host reads as clip art floating over an animation. The cohesion mechanism depends on the host's transform shape:
   - **In-plane host transforms** (rotation, uniform `scale`, translation) — the non-shell path directly inherits the host transform via per-value `inherit: true`. Slash rocks with the bell, slash scales with the heart.
   - **Axis-asymmetric host transforms** (`scaleY`-only blink, `scaleX`-only sway) — direct inheritance distorts the marker (a 45° slash inheriting `scaleY` only flattens horizontally). The non-shell path instead synthesizes an in-plane companion (uniform `scale` dip, `opacity` dip) pinned to the host's `times` so it shares a kinetic peak with the host without orientation distortion. Going fully rigid is also wrong — see the three-criteria check in step 4.
3. **Stay within the 24×24 viewBox.** Scale-based motion should be a contraction (`scale ≤ 1`), not an expansion — anatomically more accurate for most icons AND keeps the stroke inside the SVG (which defaults to `overflow: hidden`). Remember the scaled-stroke gotcha: `transform: scale(1.2)` also scales the strokeWidth by 1.2, so a path's visible edge is `scaled_endpoint + scaled_stroke_radius`, not just the scaled endpoint.

### The two tiers (brief definition)

`docs/signatures.md` section 3 is the canonical definition; the quick mental model:

- **Tier 1 — UI / state markers.** Abstract semantic decorations that *signify a state* — they don't represent anything physical. Lucide uses a fixed vocabulary of these across the catalog; when you see a path or `<circle>` matching any of these patterns, it is Tier 1 by default:

  | Suffix | Marker shape | Examples |
  |---|---|---|
  | `*-off` | diagonal strikethrough slash (`m2 2 20 20` or mirror) | `eye-off`, `cloud-off`, `bell-off`, `heart-off`, `droplet-off`, `umbrella-off`, `volume-off`, `wifi-off`, `mic-off` |
  | `*-plus` / `*-minus` | small `+` / `−` stroke pair | `bell-plus`, `heart-plus`, `clock-plus`, `cloud-plus` |
  | `*-check` / `*-x` | `✓` / `×` stroke marker | `bell-check`, `heart-x`, `clock-check`, `cloud-check` |
  | `*-dot` | small filled `<circle>` (notification dot) | `bell-dot` |
  | `*-alert` / `*-warning` | `!` exclamation or alert triangle | `cloud-alert`, `clock-alert` |
  | `*-info` | `i` stroke marker | `file-info`, `circle-info` |
  | `*-question` | `?` stroke marker | `file-question`, `message-question` |
  | `*-arrow-{up,down,left,right}` | small directional arrow at corner-badge size | `clock-arrow-up`, `clock-arrow-down` |

  **Every Tier 1 marker is authored through the family-wide modifier-reveal** (`bellModifierReveal`, `heartModifierReveal`, `cloudModifierReveal`, `eyeModifierReveal`): `pathLength` + `opacity` draw-in for path markers, or `scale` + `opacity` for `<circle>` markers (see `bellDotReveal`). Placed LAST in the compose list. Kinetic companion sharing the host's `times` per principle 2.

  **Default to the family modifier-reveal whenever you see one of these suffixes.** Don't write a one-off `matchPathD("<exact d>")` motion for a state marker — that's how the eye-off pass initially went wrong. If the family doesn't have its modifier-reveal yet, build it (matchAnyPath wildcard) — once. Every future variant in that family will route through it for free.

- **Tier 2 — Real-life-grounded elements.** Things that exist as physical parts of the depicted object — sound waves, flames, water drops, smoke, sparkles, EKG traces, cracks, gears, locks, the second hand of a clock. Bespoke physics designed from "how does this real-world thing actually behave," plus host-keyframe inheritance for cohesion.

  **Composite badges that look like state markers but belong in Tier 2** because they have their own physical/semantic motion: `*-cog` (gear rotates), `*-pen` / `*-edit` (writes), `*-lock` / `*-unlock` (clicks open/closed), `*-clock` (ticks), `*-search` (magnifier swings), `*-sync` (paired arrows rotate), `*-share` (graph). When in doubt: does the marker have a single canonical real-world motion? If yes, Tier 2.

Tier only determines what *additional* motion the path gets. Both tiers share kinetic life with the host (principle 2).

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
4. If a path's role doesn't have a clear real-life motion (e.g. a decorative state marker), use the family's coupled modifier reveal — see Step 4 item 5 for the inheritance-vs-synthesize choice and the three-criteria check.

When in doubt, ask: "Could this anatomical part move independently of the rest of the icon in reality?" If yes, it deserves its own motion. If no (rigid sub-part of a larger piece), it can share its parent's motion. Either way, the decision happens at the **path level**, not the icon level.

### Design anti-patterns — what NOT to do

Conceptual mistakes (about *what* motion to design). Technical wiring gotchas are covered separately at the end under "Common pitfalls."

- **Defaulting to a family's wildcard motion for every variant.** ("Just use `sunRotate` / `eyeBlink` / `cloudBody` for everything.") Lazy reuse reads as wrong physics — sun-moon's moon must glow, not rotate; sun-snow's snowflake must twinkle in place, not spin. Design what *this specific composite icon* does in reality, then layer specific motions per element role.
- **Generic pulse / shake / spin to make an icon "feel alive."** Those belong in `mode="pulse"` / `mode="spin"` for consumers who explicitly opt in. A signature should be a motion that *only makes sense for that icon* — flames flicker in height, hearts contract during systole, clocks tick clockwise in discrete steps, moons reflect (no radial scale).
- **Scaling up for emphasis.** Per principle 3, the right answer is almost always contraction (`scale ≤ 1`). Brightness/character comes from opacity dips or per-axis transforms, not from ballooning past the viewBox.
- **One motion smeared across an icon with multiple moving parts.** If the icon depicts something whose anatomical parts move differently in real life (clock face vs hands, bell shell vs clapper vs waves, flame vs kindling, cloud vs rain drops), each role needs its own motion matched by path data. See "Animate per path" above.
- **Partial-fixing an overlay marker.** Fixing one of the three criteria (kinetic life / non-distortion / apex alignment) by breaking another. The recurring pattern: agent fixes "marker is co-blinking" (criterion 2) by removing inheritance and breaks criterion 1 (now static); or fixes "marker is static" (criterion 1) by direct-inheriting and breaks criterion 2 (now distorted). Run all three checks; see Step 4's three-criteria table.

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
2. **Decide tier per path** (Step 1's "two tiers" definition, or section 3 of the doc). Tier only decides what *additional* motion the path gets — both tiers share kinetic life with the host (see principle 2 for the inherit-vs-synthesize rule).
3. **Reuse existing motions** by path-data match. If a variant reshapes the host's `d` slightly, extend the host motion's `matchPathDOneOf` list rather than writing a new motion.
4. **Make sure the host motion exports its keyframe constants** (`HEART_BEAT_KEYFRAMES`, `BELL_SHELL_KEYFRAMES` are the precedent). Other family motions inherit them.
5. **Tier 1 markers — recognize the suffix, then route through the family's modifier-reveal.** If the variant's name ends in `-off`, `-plus`, `-minus`, `-check`, `-x`, `-dot`, `-alert`, `-warning`, `-info`, `-question`, or `-arrow-{up,down,left,right}`, the modifier path is Tier 1 (see Step 1's "two tiers" table). Don't write a one-off specific matcher for it. Use the family-wide modifier-reveal (`heartModifierReveal`, `bellModifierReveal`, `eyeModifierReveal`) — or build one if the family doesn't have it yet: a `matchAnyPath` motion combining `pathLength` + `opacity` reveal (or `scale` + `opacity` for `<circle>` markers — see `bellDotReveal`), placed LAST in the compose list. The kinetic companion follows principle 2's host-transform-shape rule:
   - **In-plane host** → directly inherit the host's primary transform. Examples: `bellModifierReveal` inherits `BELL_SHELL_KEYFRAMES.rotate`; `heartModifierReveal` inherits `HEART_BEAT_KEYFRAMES.scale`; `cloudModifierReveal` inherits `CLOUD_BODY_KEYFRAMES.scale`.
   - **Axis-asymmetric host** → synthesize an in-plane companion (uniform `scale` dip like `[1, 0.85, 1]`, or `opacity` dip) and pin it to the host's `times`. Example: `eyeModifierReveal` defines its own `scale: [1, 0.85, 1]` over `EYE_BLINK_KEYFRAMES.times` because the eye's `scaleY`-only blink would flatten a diagonal slash if inherited directly.
6. **Tier 2 with bespoke physics** — write a new motion under `src/modes/motions/`, named `<icon>-<role>.ts`. Design it from "how does this real-world thing actually behave?". If it sits inside or attached to a transforming host, also share the host's kinetic life via principle 2 (direct inherit or synthesized companion as appropriate).
7. **Write the signature** as a thin `compose()` call (`src/modes/signatures/<icon>.ts`).
8. **Don't force motion on icons where `draw` is the right answer** — if a variant has no clear physical or semantic motion, skip its signature and let it fall back to draw.

After each phase of work, **self-review before moving on** (project memory `feedback_phase_review.md`): fix issues and re-review before the next phase.

### Three-criteria check (run on EVERY overlay marker before declaring done)

Recurring corrections happen when you fix one symptom and introduce another. To prevent that, walk every modifier-reveal and overlay marker through these three checks. All three must pass.

| # | Criterion | What it means | How to verify |
|---|---|---|---|
| 1 | **Continuous kinetic life** | The marker is doing *something* throughout the cycle — not just at start/end. A static overlay reads as disconnected from the host. | Look at the marker's `active` block. Is there a transform that varies across the cycle (rotate, scale, opacity dip)? Or does the marker only animate `pathLength` + `opacity` and otherwise sit still? Sit-still = fail. |
| 2 | **Non-distortion** | The marker's intrinsic shape stays intact (a 45° diagonal slash stays a 45° diagonal; a `+` sign stays orthogonal). No axis-asymmetric host transform inherited directly. | Is the marker inheriting `scaleY` only or `scaleX` only from the host? If yes, replace with synthesized in-plane companion (see step 5). |
| 3 | **Apex alignment** | The marker's `pathLength` strike *completes at* the host's primary event peak, not after it. The draw-in and the host's peak event share one peak. | Compare the marker's `pathLength` times to the host's keyframe times. The end of the strike (`pathLength → 1`) should land at the same time fraction as the host's apex (e.g. `0.5` for `EYE_BLINK_KEYFRAMES.times = [0, 0.5, 1]`). |

The recurring failure mode this guards against: fix criterion 2 by removing inheritance → break criterion 1 (marker now static). Or fix criterion 1 by inheriting → break criterion 2 (marker distorts). The synthesized in-plane companion + apex-aligned pathLength is the configuration that satisfies all three.

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
- **What to look for** — frame this as the three-criteria check so the user knows what visual signal to attend to:
  1. **Real-life motion reads correctly** — flame flickers in height, heart contracts inward, clock ticks discretely, etc. No generic pulse/spin that could apply to any icon.
  2. **Overlay markers have continuous kinetic life AND stay undistorted AND complete at the host's apex** — slash strikes through *as* the eye reaches max-close (not after); the slash stays a 45° diagonal throughout (no horizontal flattening); the slash isn't a static line popping in over a moving icon.
  3. **No clipping at the 24×24 edges, no static modifiers floating over moving icons.**

**Do not start the next family without explicit user approval.** One family per invocation. The user reviews visually, requests adjustments if needed (those become a refinement `fix(lib): ...` commit), then approves moving on.

## Common pitfalls — technical wiring gotchas (re-read before submitting)

Distinct from the conceptual anti-patterns above; these are the wiring traps that produce silent/subtle bugs even when the design is right.

- **`inherit: true` on every per-value transition.** Required because motion-dom otherwise replaces the parent transition entirely, dropping `duration` / `delay` / `repeat` and falling back to its default 300 ms — the modifier ends up out of phase with the rest of the icon.
- **Match by `d` data, not `ctx.index`.** Lucide reorders paths sometimes. Use `matchPathD`, `matchPathDOneOf`, a regex over `pathAttrs.d`, or `<circle>` geometry (`cx` / `cy` / `r`).
- **`matchAnyPath` is greedy — last in the compose list.** Otherwise it claims paths that need bespoke physics. The compose iterator is first-match-wins (`src/modes/compose.ts`).
- **`scale > 1` clips at viewBox edges.** Design scale rhythms as contractions. Also remember the scaled-stroke gotcha — `transform: scale(1.2)` scales `strokeWidth` by 1.2 too, so the visible edge is `scaled_endpoint + scaled_stroke_radius`.
- **Regenerate after writing a signature.** The codegen reads `src/modes/signatures/` at generate-time; `prebuild` and `predev` handle it automatically, but standalone changes need a manual `pnpm --filter lucide-react-motion generate`.
- **Run the three-criteria check on every overlay marker before commit.** See the table in Step 4. The recurring failure mode is partial-fixing one criterion and silently breaking another.

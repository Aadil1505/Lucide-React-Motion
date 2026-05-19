import { type Motion } from "../compose";

/**
 * The three "blade" paths in `loader-pinwheel` — Lucide renders the
 * pinwheel as a horizontal S-curve plus two diagonal S-curves meeting
 * at the centre. Together with the outer hub ring (handled separately
 * by {@link import("./loader-pinwheel-hub").loaderPinwheelHub}) they
 * make up the four-element pinwheel anatomy.
 *
 * **Real-life motion**: a held pinwheel catches the wind. Two things
 * read as "this is a pinwheel and not just any spinner":
 *
 * - **Gust-driven rotation.** Wind isn't a steady torque; it surges
 *   and falls. Each revolution surges through its middle and eases
 *   into the next via `easeInOut`, which is the same cadence the
 *   hub ring inherits so the assembly stays rigidly coupled.
 * - **Per-blade reflectance phase.** As a real pinwheel rotates, at
 *   any instant one blade is facing you flat (bright) while the
 *   others are foreshortened or edge-on (dimmer). The blades pass
 *   through these reflectance angles in turn, so the dim moment
 *   *waves around the pinwheel* rather than pulsing all three blades
 *   together. Each blade dips to opacity ≈ 0.55 once per revolution
 *   at its own phase (0, 1/3, 2/3 of the cycle) — keyed by the
 *   path's `d` string, NOT by `ctx.index`, so a Lucide reordering
 *   can't silently break the staggering.
 *
 * Rotation always returns to the same visual position at end-of-cycle
 * (360 ≡ 0) and each blade's opacity wraps to the same value at the
 * loop seam — so the seamless `repeat: Infinity` loop is preserved.
 *
 * Pivots at the icon centre (12, 12); the signature uses the default
 * `transformOrigin` so each blade spins around the pinwheel's hub.
 *
 * **ViewBox safety**: no scale is applied — pure rotation around the
 * centre cannot push the stroke outside the 24×24 viewBox.
 *
 * Exports `LOADER_PINWHEEL_KEYFRAMES` so the hub ring inherits the
 * same rotation cadence and the pinwheel reads as one rigid body.
 */
export const LOADER_PINWHEEL_KEYFRAMES = {
  rotate: [0, 360],
  rotateTimes: [0, 1],
};

/**
 * Per-blade reflectance curves. Each blade has exactly one dim trough
 * per revolution; the three troughs are evenly spaced 1/3 of the
 * cycle apart so at any given moment one blade is edge-on and dim
 * while the other two are face-on and bright. The first and last
 * keyframes in every blade's array match so the loop seam is
 * invisible at `repeat: Infinity`.
 *
 * `times` is shared — only the *values at each time index* differ
 * between blades, which is exactly what "phase shift" means here.
 */
const REFLECTANCE_TIMES = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];

/**
 * Map of blade `d` string → reflectance curve. Three blades, three
 * phases. Matching by `d` (not by `ctx.index`) — Lucide can reorder
 * paths across versions, but the path data is stable.
 *
 * Blade roles (named by what they depict visually before rotation):
 * - Horizontal blade  → phase 0  (dim at t=0 and t=1, loop-seam aligned)
 * - Ascending blade   → phase 1/3 (dim at t=1/3 of the cycle)
 * - Descending blade  → phase 2/3 (dim at t=2/3 of the cycle)
 */
const BLADE_REFLECTANCE_BY_D: Record<string, number[]> = {
  // Horizontal S-curve — dim at the cycle endpoints (a single trough
  // that wraps across the seam).
  "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0": [0.55, 1, 1, 1, 1, 1, 0.55],
  // Ascending diagonal — dim a third of the way through.
  "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6": [1, 1, 0.55, 1, 1, 1, 1],
  // Descending diagonal — dim two-thirds of the way through.
  "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6": [1, 1, 1, 1, 0.55, 1, 1],
};

const BLADE_PATHS = new Set(Object.keys(BLADE_REFLECTANCE_BY_D));

export const loaderPinwheelBlade: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" && BLADE_PATHS.has(String(ctx.pathAttrs.d)),
  factory: (ctx) => {
    const opacity =
      BLADE_REFLECTANCE_BY_D[String(ctx.pathAttrs.d)] ??
      [1, 1, 1, 1, 1, 1, 1];
    return {
      rest: { rotate: 0, opacity: 1 },
      active: {
        rotate: LOADER_PINWHEEL_KEYFRAMES.rotate,
        opacity,
        transition: {
          duration: ctx.duration,
          // Pinwheel paths spin in lockstep — no per-index stagger on
          // the loop start so the rigid body stays rigid through the
          // rotation. The per-blade phase comes from the opacity
          // keyframe arrays above, not from per-blade `delay`.
          delay: ctx.delay,
          repeat: ctx.repeat,
          // Gust-driven cadence: each revolution surges through its
          // middle and eases as the gust falls before the next.
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: LOADER_PINWHEEL_KEYFRAMES.rotateTimes,
          },
          // Reflectance dip per blade uses smooth linear interpolation
          // between keyframes so each trough reads as an angle-of-
          // incidence sweep, not a punchy beat.
          opacity: {
            inherit: true,
            ease: "linear",
            times: REFLECTANCE_TIMES,
          },
        },
      },
    };
  },
};

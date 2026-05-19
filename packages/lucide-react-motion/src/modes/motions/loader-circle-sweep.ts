import { matchPathD, type Motion } from "../compose";

/**
 * The `loader-circle` arc — Lucide's three-quarter-circle stroke that
 * starts at (21, 12) and sweeps clockwise to (14.78, 3.44). Visually
 * it's the canonical SVG/CSS loading spinner: a partial ring chasing
 * its own gap as it rotates.
 *
 * **Real-life motion**: real progress spinners aren't perfectly uniform
 * tachometers — they read as *alive* because of subtle non-linearities
 * in how the loop renders. A pure linear spin (what
 * {@link import("./loader-spin").loaderSpin} provides for the base
 * `loader` icon, and what `mode="spin"` offers as a generic) feels
 * mechanical. This signature adds two characteristics that make
 * `loader-circle` read as "the system is working":
 *
 * - **Surge-and-settle ease per cycle.** `easeInOut` on the rotation
 *   gives every full revolution a built-in acceleration at the start
 *   and a slight deceleration as the gap rolls back into view —
 *   different feel from the base loader's perfectly linear spin.
 * - **Reflectance breath.** A subtle mid-cycle opacity dim
 *   (≈ 0.78 at t=0.5) reads as the arc passing through a moment of
 *   "load" before the next surge begins. Without it a stationary
 *   spinner can look frozen between gusts of activity; with it the
 *   icon is unmistakably indeterminate progress.
 *
 * Pivots at the icon centre (12, 12) — the signature uses the default
 * `transformOrigin` so the arc rotates around its own geometric
 * centre and never translates.
 *
 * **ViewBox safety**: the arc already lives at full radius 9 inside
 * the 24×24 viewBox, so no scale is applied here — rotation around
 * the centre cannot push the stroke outside. Opacity is a non-
 * transform property and is bounds-safe by construction.
 *
 * Exports `LOADER_CIRCLE_KEYFRAMES` for future loader-family variants
 * that should sit on top of the same surge-and-settle cadence.
 */
export const LOADER_CIRCLE_KEYFRAMES = {
  rotate: [0, 360],
  opacity: [1, 0.78, 1],
  times: [0, 0.5, 1],
};

const LOADER_CIRCLE_D = "M21 12a9 9 0 1 1-6.219-8.56";

export const loaderCircleSweep: Motion = {
  matches: matchPathD(LOADER_CIRCLE_D),
  factory: (ctx) => ({
    rest: { rotate: 0, opacity: 1 },
    active: {
      rotate: LOADER_CIRCLE_KEYFRAMES.rotate,
      opacity: LOADER_CIRCLE_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Rotation surges then settles — different from a flat linear
        // spin; reads as "working harder through the visible arc".
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 1],
        },
        // Brightness dips once per revolution at the cycle midpoint —
        // the spinner takes a breath before the next surge.
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: LOADER_CIRCLE_KEYFRAMES.times,
        },
      },
    },
  }),
};

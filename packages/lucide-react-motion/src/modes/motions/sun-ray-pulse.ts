import { matchAnyPath, type Motion } from "../compose";

/**
 * Sunray pulse — Tier 2 motion for a sun's body and its radiating
 * rays. Used as the wildcard catch-all in every sun-family
 * signature.
 *
 * **Real-life motion**: a real sun emits light continuously, but the
 * impression of "alive" sunlight comes from subtle brightness
 * fluctuations and the apparent variation in ray length as the
 * atmosphere refracts the light. Modeled here as a gentle outward
 * scale (so each ray "lengthens" toward its tip) combined with a
 * brightness dip and recovery (so the path appears to flare).
 *
 * Pivot point: the signature's `transformOrigin` should be the sun's
 * actual centre. For `sun-dim` and `sun-medium` that's the icon
 * centre (12, 12); for `sun-snow` the sun sits on the left so the
 * signature pivots at (10, 12). With the pivot correctly placed at
 * the sun's own centre, each ray's `scale > 1` translates the ray
 * outward along its emission direction — exactly how rays appear to
 * radiate from a source.
 *
 * Per-path stagger via `ctx.index * ctx.stagger` cascades the pulse
 * through the icon's paths so the rays light up in sequence rather
 * than all at once. The central circle is first in Lucide's path
 * order for `sun-dim` and `sun-medium`, so the cascade reads as the
 * sun's centre pulsing first and the rays following — a wave of
 * light radiating outward from the surface.
 *
 * **ViewBox safety**: scale peaks at 1.06. For the regular `sun`'s
 * rays that extend to y=2 (one viewBox unit from the edge at
 * strokeWidth=2) this leaves the outermost stroke at y≈0.4 — inside.
 * Every other sun variant has rays further from the viewBox edge so
 * the same amplitude has more headroom there.
 */
export const sunRayPulse: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 1.06, 1],
      opacity: [1, 0.45, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
      },
    },
  }),
};

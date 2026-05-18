import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The five paths that draw the 6-armed snowflake on the right side
 * of `sun-snow` (Lucide's composite "sunny + snowy" weather icon).
 * Tier 2 motion: a snowflake depicts a real ice crystal, so it gets
 * bespoke twinkle physics rather than reusing the sun's ray pulse.
 *
 * **Real-life motion**: ice crystals don't grow and shrink — they
 * sparkle by reflecting light in sharp flashes as the crystal's
 * facets align with and lose alignment with light sources. The
 * dominant variation is brightness, not size. Modeled here as a
 * sharp opacity double-pulse (a bright flash, a dim, a brighter
 * flash, a softer dim, settle) layered over a barely-perceptible
 * scale wobble for cohesion with the sun's ray pulse — both halves
 * of the icon read as alive without the snowflake claiming the
 * sun's emission character.
 *
 * The opacity dip goes deeper than `sunRayPulse`'s (0.3 vs 0.45)
 * because a real snowflake's sparkle has higher contrast than the
 * sun's steady glow — facets either catch the light or they don't.
 *
 * Place this *before* `sunRayPulse` in the compose motions list so
 * the snowflake's specific d-matches win over the wildcard.
 */
const SNOWFLAKE_PATHS = [
  "m14 20 1.25-2.5L18 18",
  "m14 4 1.25 2.5L18 6",
  "m17 21-3-6 1.5-3H22",
  "m17 3-3 6 1.5 3",
  "m20 10-1.5 2 1.5 2",
];

export const snowflakeTwinkle: Motion = {
  matches: matchPathDOneOf(...SNOWFLAKE_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 1.02, 0.98, 1.01, 1],
      opacity: [1, 0.3, 1, 0.55, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: [0, 0.2, 0.4, 0.65, 1],
        repeat: ctx.repeat,
      },
    },
  }),
};

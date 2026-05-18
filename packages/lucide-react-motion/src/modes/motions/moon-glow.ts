import { matchPathD, type Motion } from "../compose";

/**
 * The moon crescent in `sun-moon` — Lucide's composite
 * dark-mode-toggle icon (a few sun rays + a sun quarter-arc + this
 * dominant moon shape). Tier 2 motion: the moon depicts an actual
 * celestial body, so it gets bespoke physics rather than reusing
 * the sun's ray pulse.
 *
 * **Real-life motion**: the moon doesn't *emit* light — it reflects
 * sunlight, so it doesn't radiate outward the way the sun's rays do.
 * Modeled here as an opacity-only soft dim and return: the moon
 * glows steadily, with a subtle brightness lull mid-animation that
 * reads as the moon's phase shifting rather than the moon itself
 * moving.
 *
 * No scale on purpose: the crescent sits off the icon centre, and
 * the signature's `transformOrigin` is set for the sun's radiation
 * pattern. Scaling the moon around the sun's pivot would translate
 * the crescent away from its rest position — exactly the "clip art
 * over animation" anti-pattern. Opacity sidesteps the origin
 * entirely.
 *
 * Place this *before* `sunRayPulse` in the compose motions list so
 * the moon's specific d-match wins over the wildcard.
 */
const MOON_D =
  "M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715";

export const moonGlow: Motion = {
  matches: matchPathD(MOON_D),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.65, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
      },
    },
  }),
};

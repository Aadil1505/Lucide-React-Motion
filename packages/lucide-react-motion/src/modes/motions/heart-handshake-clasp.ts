import { matchPathD, type Motion } from "../compose";

/**
 * Soft "shared warmth" pulse for the `heart-handshake` icon.
 *
 * **Constraint**: Lucide draws heart-handshake as a single merged path —
 * the heart on top and the two clasping hands below are one continuous
 * outline, not separable elements. That means any transform applies to
 * the whole thing at once, so we can't pulse the heart while keeping the
 * hands still.
 *
 * **Reading**: rather than fight that constraint, the motion leans into
 * it. The entire icon does a single gentle scale bump from the icon
 * center — a quiet inhale-and-settle that reads as warmth being given
 * and received between the clasped hands. Amplitude is intentionally
 * small (6%) so the hands don't visibly inflate; the heart sits at icon
 * center where the scale effect is most legible.
 *
 * Tier 2 in spirit (the icon depicts a real human moment) but the merged
 * path forces a whole-icon gesture rather than per-element physics.
 */
const HANDSHAKE_D =
  "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762";

export const heartHandshakeClasp: Motion = {
  matches: matchPathD(HANDSHAKE_D),
  factory: (ctx) => ({
    rest: { scale: 1 },
    active: {
      scale: [1, 1.06, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: [0, 0.4, 1],
        repeat: ctx.repeat,
      },
    },
  }),
};

import { matchAnyPath, type Motion } from "../compose";
import { HEART_BEAT_KEYFRAMES } from "./heart-beat";

/**
 * Heart-family wildcard reveal — `modifierReveal`'s draw-in (pathLength
 * + opacity) plus the host `heartBeat` scale so every non-shell path in
 * a heart variant moves *with* the heart instead of floating statically
 * over a contracting shape.
 *
 * Catches whatever's left after `heartBeat` matches the heart shell:
 * - heart-crack's zigzag crack (inside the heart)
 * - heart-plus / heart-minus / heart-x marker strokes (carved corner)
 * - heart-off's diagonal slash
 *
 * Scale uses `inherit: true` so the host transition's duration / delay
 * / repeat propagate down. Without that, motion-dom replaces the
 * parent transition entirely and the per-value block falls back to its
 * default 300 ms — completely out of sync with the heart's 800 ms beat.
 *
 * Place this last in the compose `motions` list so more specific
 * matches (the heart shell) get tried first.
 */
export const heartModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { pathLength: 1, opacity: 1, scale: 1 },
    active: {
      pathLength: [0, 0, 1],
      opacity: [0, 0, 1],
      scale: HEART_BEAT_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Reveal runs on its own delayed-draw schedule.
        pathLength: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        // Scale piggybacks on the host heart's lub-dub.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: HEART_BEAT_KEYFRAMES.times,
        },
      },
    },
  }),
};

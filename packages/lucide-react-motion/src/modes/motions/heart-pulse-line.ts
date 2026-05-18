import { matchPathD, type Motion } from "../compose";
import { HEART_BEAT_KEYFRAMES } from "./heart-beat";

/**
 * EKG trace draw for the `heart-pulse` waveform.
 *
 * **Real-life motion**: a heart monitor draws the trace left-to-right at
 * a constant chart speed, the QRS spike landing as the heart contracts.
 * Modeled with `pathLength` sweeping 0 → 1 at linear ease across the
 * duration so the line "writes itself" along the wave's intrinsic
 * direction, mimicking paper-tape monitors. Opacity comes up on the
 * leading edge so the line doesn't appear instantly — feels like the
 * monitor warming up, then drawing.
 *
 * **Beats with the host heart**: the line passes through the heart's
 * body, so it gets the host `heartBeat` scale keyframes applied too —
 * the trace breathes in sync with the heart's contractions rather than
 * floating statically over a beating shape. Per-value transitions
 * separate the linear paper-tape draw from the scale's lub-dub timing.
 *
 * Tier 2: the EKG trace depicts the heart's electrical signal — an
 * actual physical readout — so it gets bespoke draw-it-in motion rather
 * than the generic `modifierReveal` used for UI markers like + or ×.
 */
const PULSE_LINE_D = "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27";

export const heartPulseLine: Motion = {
  matches: matchPathD(PULSE_LINE_D),
  factory: (ctx) => ({
    rest: { pathLength: 1, opacity: 1, scale: 1 },
    active: {
      pathLength: [0, 0, 1],
      opacity: [0, 1, 1],
      scale: HEART_BEAT_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // EKG trace draws at constant paper-tape speed regardless of
        // the icon's easing — pathLength + opacity stay linear.
        // `inherit: true` shallow-merges with the parent transition so
        // duration/delay/repeat propagate down; without it motion-dom
        // replaces the whole transition with this object and falls back
        // to its default 300ms timing.
        pathLength: { inherit: true, ease: "linear", times: [0, 0.08, 1] },
        opacity: { inherit: true, ease: "linear", times: [0, 0.08, 1] },
        // Scale follows the host heart's lub-dub so the line beats too.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: HEART_BEAT_KEYFRAMES.times,
        },
      },
    },
  }),
};

import { matchPathD, type Motion } from "../compose";

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
 * Tier 2: the EKG trace depicts the heart's electrical signal — an
 * actual physical readout — so it gets bespoke draw-it-in motion rather
 * than the generic `modifierReveal` used for UI markers like + or ×.
 *
 * Pairs with `heartBeat` on the same icon: the heart contracts on its
 * own lub-dub rhythm while the line traces underneath, the two reading
 * as related without being mechanically synchronized.
 */
const PULSE_LINE_D = "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27";

export const heartPulseLine: Motion = {
  matches: matchPathD(PULSE_LINE_D),
  factory: (ctx) => ({
    rest: { pathLength: 1, opacity: 1 },
    active: {
      pathLength: [0, 0, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: "linear",
        times: [0, 0.08, 1],
        repeat: ctx.repeat,
      },
    },
  }),
};

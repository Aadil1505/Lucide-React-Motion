import { type Motion } from "../compose";
import { LOADER_PINWHEEL_KEYFRAMES } from "./loader-pinwheel-blade";

/**
 * The outer ring of `loader-pinwheel` — Lucide's
 * `<circle cx="12" cy="12" r="10">` that circumscribes the three
 * blades. In the real-world referent this is the rim of the toy or
 * the housing the blades spin within; it has rotational symmetry, so
 * it does *not* catch wind reflectance the way the blades do — it
 * simply rotates rigidly with them.
 *
 * **Couples to the blades**: rotation piggybacks on
 * `LOADER_PINWHEEL_KEYFRAMES.rotate` via `inherit: true` so the hub
 * and blades stay rigidly coupled through every gust. Without this
 * coupling the rim would either run on motion-dom's default 300 ms
 * transition (out-of-phase with the blades) or do nothing — both
 * read as "the rim is floating over a spinning pinwheel".
 *
 * No bespoke physics of its own: a circle has no reflectance
 * variation under rotation, so opacity stays flat.
 *
 * Pivots at the icon centre (12, 12) by inheriting the signature's
 * default `transformOrigin`. No scale is applied; pure rotation
 * cannot push the stroke outside the 24×24 viewBox.
 */
export const loaderPinwheelHub: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "12" &&
    String(ctx.pathAttrs.cy) === "12" &&
    String(ctx.pathAttrs.r) === "10",
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: LOADER_PINWHEEL_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        // Inherit the blades' gust-driven cadence so the rim and the
        // blades stay rigid together.
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: LOADER_PINWHEEL_KEYFRAMES.rotateTimes,
        },
      },
    },
  }),
};

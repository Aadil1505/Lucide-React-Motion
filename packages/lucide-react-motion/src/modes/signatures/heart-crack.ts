import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { modifierReveal } from "../motions/modifier-reveal";

/**
 * Heart beats (shared `heartBeat` — the heart-crack base shape is one of
 * the registered shell variants), and the zigzag crack reveals itself
 * mid-beat via `modifierReveal`. The crack drawing on top of a still-
 * beating heart reads as "this heart is broken but it carries on."
 */
export default compose({
  motions: [heartBeat, modifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

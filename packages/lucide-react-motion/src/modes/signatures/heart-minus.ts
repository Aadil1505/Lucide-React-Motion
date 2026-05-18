import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartModifierReveal } from "../motions/heart-modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the − stroke draws itself in
 * mid-beat while scaling with the host via `heartModifierReveal` so
 * the marker stays anchored through the contraction.
 */
export default compose({
  motions: [heartBeat, heartModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

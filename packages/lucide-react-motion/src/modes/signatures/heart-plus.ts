import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartModifierReveal } from "../motions/heart-modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the + strokes reveal themselves
 * mid-beat while scaling with the host via `heartModifierReveal`. Both
 * strokes are caught by the wildcard so they draw in together as one
 * unit and stay anchored to the heart through the lub-dub.
 */
export default compose({
  motions: [heartBeat, heartModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

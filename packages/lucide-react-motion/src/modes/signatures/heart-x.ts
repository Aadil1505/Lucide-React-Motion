import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartModifierReveal } from "../motions/heart-modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the × strokes draw themselves
 * in mid-beat while scaling with the host via `heartModifierReveal`.
 * Both strokes are caught by the wildcard so they reveal as a unit and
 * stay anchored through the beat — reads as "cancelled" landing on top
 * of a still-beating heart.
 */
export default compose({
  motions: [heartBeat, heartModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

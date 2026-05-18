import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { modifierReveal } from "../motions/modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the × strokes draw themselves in
 * mid-beat via `modifierReveal`. Both × strokes are caught by the
 * wildcard so they reveal together as a unit — reads as "cancelled"
 * landing on top of the beating heart.
 */
export default compose({
  motions: [heartBeat, modifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

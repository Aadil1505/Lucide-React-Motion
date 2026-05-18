import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { modifierReveal } from "../motions/modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the + strokes reveal themselves
 * mid-beat via `modifierReveal`. Both plus strokes are matched by the
 * wildcard so they draw in together — no need to motion each stroke
 * independently.
 */
export default compose({
  motions: [heartBeat, modifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

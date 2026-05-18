import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartModifierReveal } from "../motions/heart-modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the zigzag crack reveals itself
 * mid-beat while breathing with the host via `heartModifierReveal` —
 * the crack is part of the heart's surface so it scales along rather
 * than floating statically over a contracting shape.
 */
export default compose({
  motions: [heartBeat, heartModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { modifierReveal } from "../motions/modifier-reveal";

/**
 * Heart beats (shared `heartBeat`), and the − stroke draws itself in
 * mid-beat via `modifierReveal` so the "removed" state registers after
 * the host motion has read.
 */
export default compose({
  motions: [heartBeat, modifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

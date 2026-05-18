import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartPulseLine } from "../motions/heart-pulse-line";

/**
 * Heart beats while the EKG line traces itself in underneath. Tier-2
 * signature: the pulse line depicts a real physiological readout, so it
 * gets bespoke `pathLength` draw motion instead of a generic reveal.
 */
export default compose({
  motions: [heartBeat, heartPulseLine],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

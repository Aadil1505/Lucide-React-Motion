import { compose } from "../compose";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Sun-medium — the medium-intensity variant of the sun: a central
 * circle plus eight short ray-nub segments at the cardinal and
 * diagonal positions (shorter than `sun`'s full rays, longer than
 * `sun-dim`'s dots). Tier-2 signature: the sun's centre pulses
 * first and each ray follows in cascade via the shared
 * {@link sunRayPulse} motion, so the rays appear to lengthen
 * outward in turn — light radiating from the sun's surface.
 *
 * The icon centre (12, 12) is also the sun's centre here, so the
 * default transform origin is correct without an override.
 */
export default compose({
  motions: [sunRayPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});

import { compose } from "../compose";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Sun-dim — the dimmer variant of the sun: a central circle plus
 * eight degenerate dots at the cardinal and diagonal "ray" positions
 * where the regular sun has full ray segments. Tier-2 signature: the
 * sun's centre pulses first and each ray-dot follows in cascade via
 * the shared {@link sunRayPulse} motion, so the brightness ripples
 * outward from the icon's centre — a wave of light radiating from
 * the sun's surface in the same direction real sunlight would.
 *
 * The icon centre (12, 12) is also the sun's centre here, so the
 * default transform origin is correct without an override.
 */
export default compose({
  motions: [sunRayPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});

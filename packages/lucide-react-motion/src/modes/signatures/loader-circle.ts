import { compose } from "../compose";
import { loaderCircleSweep } from "../motions/loader-circle-sweep";

/**
 * Loader-circle signature — the partial-ring spinner sweeps continuously
 * around its centre with an `easeInOut` cadence and a mid-cycle opacity
 * breath. Differs from the base `loader` signature (uniform linear spin
 * across radial rays) and from the generic `mode="spin"` (no opacity
 * breath) so that the variant has its own identity rather than just
 * inheriting any-old-rotation.
 */
export default compose({
  motions: [loaderCircleSweep],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0, repeat: Infinity },
});

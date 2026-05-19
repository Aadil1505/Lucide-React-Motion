import { compose } from "../compose";
import { loaderPinwheelBlade } from "../motions/loader-pinwheel-blade";
import { loaderPinwheelHub } from "../motions/loader-pinwheel-hub";

/**
 * Loader-pinwheel signature — three blades spin rigidly with the
 * outer rim while reflectance dims wave around the blades (each blade
 * dips at its own phase of the rotation, like real wind catching one
 * face at a time). Distinct from the base `loader` and `loader-circle`
 * signatures by virtue of the per-blade phase shift; this only makes
 * sense for a multi-blade pinwheel.
 */
export default compose({
  motions: [loaderPinwheelBlade, loaderPinwheelHub],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0, repeat: Infinity },
});

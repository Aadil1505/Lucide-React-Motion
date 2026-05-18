import { compose } from "../compose";
import { heartHandshakeClasp } from "../motions/heart-handshake-clasp";

/**
 * A single gentle pulse from the icon center. The Lucide path fuses the
 * heart with the clasping hands into one continuous outline, so per-
 * element motion isn't available — see the docstring on
 * `heartHandshakeClasp` for why this stays subtle.
 */
export default compose({
  motions: [heartHandshakeClasp],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

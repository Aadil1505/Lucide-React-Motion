import { compose } from "../compose";
import { snowflakeTwinkle } from "../motions/snowflake-twinkle";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Sun-snow — Lucide's composite "sunny + snowy" weather icon: a
 * half-sun (a left-facing half-arc plus six rays at the cardinals
 * and diagonals around it) on the left side of the icon, and a
 * 6-armed snowflake on the right.
 *
 * The two halves get bespoke physics that mirror their real-life
 * behaviour. The sun radiates outward via {@link sunRayPulse} — its
 * rays appear to lengthen and brighten in a cascade from the sun's
 * centre. The snowflake's arms catch the light in sharp opacity
 * flashes via {@link snowflakeTwinkle} — ice crystals sparkle by
 * reflecting light, not by changing size.
 *
 * Transform-origin override: the sun's actual centre is (10, 12),
 * not the icon centre — the snowflake on the right pushes the
 * composition off-centre. Pivoting at (10, 12) makes the sun's rays
 * radiate cleanly outward from where the half-sun physically sits.
 * The snowflake's mostly-opacity twinkle is largely unaffected by
 * the off-centre pivot (only the negligible scale wobble inherits
 * it, and that's intentional cohesion with the sun's pulse).
 */
export default compose({
  motions: [snowflakeTwinkle, sunRayPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
  transformOrigin: "10px 12px",
});

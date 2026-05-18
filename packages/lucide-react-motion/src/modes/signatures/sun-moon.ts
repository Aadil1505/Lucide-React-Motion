import { compose } from "../compose";
import { moonGlow } from "../motions/moon-glow";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Sun-moon — Lucide's composite dark-mode-toggle icon: a top sun
 * ray, two diagonal/horizontal sun rays, an upper-right sun
 * quarter-arc (the visible sliver of sun behind the moon), and the
 * dominant moon crescent.
 *
 * The two halves get bespoke physics that mirror their real-life
 * behaviour. The sun parts radiate outward from the icon centre via
 * {@link sunRayPulse} — pulsing brightness with each ray apparently
 * lengthening toward its tip. The moon crescent glows softly via
 * {@link moonGlow} — opacity-only because the moon reflects light
 * rather than emitting it, so scaling it would read as the moon
 * inflating, which doesn't happen.
 *
 * The sun quarter-arc sits centred at (12, 12), the same as the
 * default transform origin, so the sun's pivot is correct without
 * an override.
 */
export default compose({
  motions: [moonGlow, sunRayPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});

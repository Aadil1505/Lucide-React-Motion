import { matchAnyPath, type Motion } from "../compose";

/**
 * Eye-family wildcard reveal — a stable `pathLength` + `opacity` draw-in
 * that strikes through on top of the eye. Used for any state modifier
 * overlaid on the eye (the diagonal slash in `eye-off`, and future
 * markers like plus / minus / check / dot / x if Lucide ships them).
 *
 * Crucially, this motion does NOT inherit the host `eyeBlink`'s
 * `scaleY` collapse, even though the bell / heart / cloud family
 * modifier-reveals do inherit their host's primary transform. Why the
 * deviation: the eye's primary motion is asymmetric (scaleY only — a
 * vertical squeeze). A 45° diagonal slash inheriting a vertical squeeze
 * would flatten asymmetrically toward the horizontal axis, which reads
 * as "the slash itself is also blinking" rather than as a strikethrough
 * sitting on top of a blinking eye. So the overlay stays rigid and the
 * eye blinks underneath it.
 *
 * Rule of thumb (capture in the family skill if extending to more
 * icons): overlay modifiers inherit the host's primary transform when
 * that transform is in-plane — rotation, uniform scale, translation
 * (slash rocks with bell, slash scales with heart). Overlay modifiers
 * stay rigid when the host's primary transform is axis-asymmetric
 * (scaleY only, scaleX only) because inheriting distorts the marker
 * unnaturally.
 *
 * Catches whatever's left after `eyeBlink` matches the registered eye-
 * body paths and pupil circle. Place this LAST in the compose `motions`
 * list — `matchAnyPath` is greedy and would otherwise claim eye-body
 * paths.
 */
export const eyeModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { pathLength: 1, opacity: 1 },
    active: {
      pathLength: [0, 0, 1],
      opacity: [0, 0, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Marker draws in on its own delayed schedule — holds invisible
        // through the eye's collapse, strikes in as the eye reopens, and
        // stays drawn through the rest of the cycle. No `inherit: true`
        // on a host transform because the eye's scaleY is asymmetric;
        // see the docblock above.
        pathLength: { ease: "easeOut", times: [0, 0.25, 0.6] },
        opacity: { ease: "easeOut", times: [0, 0.25, 0.6] },
      },
    },
  }),
};

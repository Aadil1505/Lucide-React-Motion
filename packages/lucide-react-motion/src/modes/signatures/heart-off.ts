import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { heartModifierReveal } from "../motions/heart-modifier-reveal";

/**
 * The heart still tries to beat — both fragments are registered shell
 * variants in `heartBeat`, so they pump together around the icon
 * center even though the slash visually divides them — and the
 * diagonal slash strikes through mid-beat via `heartModifierReveal`,
 * scaling with the host so it stays consistent with the rest of the
 * icon's motion. The "silenced" reading comes from the slash appearing
 * on top, not from disabling the beat.
 */
export default compose({
  motions: [heartBeat, heartModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

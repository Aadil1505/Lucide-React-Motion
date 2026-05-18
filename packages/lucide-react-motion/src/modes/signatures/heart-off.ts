import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { modifierReveal } from "../motions/modifier-reveal";

/**
 * The heart still tries to beat — both fragments are registered shell
 * variants in `heartBeat`, so they pump together around the icon center
 * even though the slash visually divides them — and the diagonal slash
 * strikes through mid-beat via `modifierReveal`. The "silenced" reading
 * comes from the slash appearing on top, not from disabling the beat
 * (mirrors how `bell-off` keeps the bell rocking under the slash).
 */
export default compose({
  motions: [heartBeat, modifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});

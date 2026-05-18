import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Lub-dub heart beat — scale keyframes with weighted `times` so the second
 * pump lands faster than the first, matching the rhythm of a real heartbeat.
 *
 * Lucide reshapes the heart across variants to leave room for whatever
 * modifier the variant carries (plus, minus, x, slash, crack, etc.). Every
 * known heart-shape variation goes through the same lub-dub physics — this
 * list is the registry of "what counts as a heart body." Adding a new heart
 * variant means appending its body `d` string(s) here.
 *
 * Heart-off contributes two fragments (one path per arc, split by the
 * slash); both go through the same beat so the fragments pump together
 * around the icon center, the way a real heart does even when shown
 * silenced.
 *
 * Heart-handshake is intentionally NOT included — its single merged path
 * fuses the heart with the clasping hands and gets its own gentler motion
 * (`heartHandshakeClasp`) so the hands don't inflate.
 */
const HEART_PATHS = [
  // heart, heart-pulse (identical base d)
  "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
  // heart-crack (rewound winding direction, closed with z)
  "M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z",
  // heart-minus (carved upper-right to leave room for the minus)
  "m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572",
  // heart-plus (carved further to leave room for the +)
  "m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49",
  // heart-x (lower-right carved out for the ×)
  "M21.955 8.774a5.5 5.5 0 0 0-9.546-2.95.6.6 0 0 1-.818 0A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.508 5.332a2 2 0 0 0 2.57.352",
  // heart-off upper-right arc (split by the diagonal slash)
  "M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655",
  // heart-off lower-left arc
  "m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761",
];

export const heartBeat: Motion = {
  matches: matchPathDOneOf(...HEART_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1 },
    active: {
      scale: [1, 1.2, 0.92, 1.15, 0.96, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
        times: [0, 0.15, 0.3, 0.45, 0.6, 1],
      },
    },
  }),
};

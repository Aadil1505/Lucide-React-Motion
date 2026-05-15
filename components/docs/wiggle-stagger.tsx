"use client";

import { Sparkles } from "@/src/generated";

/** Live demo for the function-form `variants` example on the custom-motion docs page. */
export function WiggleStagger() {
  return (
    <Sparkles
      size={48}
      variants={(i) => ({
        rest: { rotate: 0 },
        active: {
          rotate: [0, -15, 12, -8, 0],
          transition: { duration: 0.5, delay: i * 0.06 },
        },
      })}
      style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
    />
  );
}

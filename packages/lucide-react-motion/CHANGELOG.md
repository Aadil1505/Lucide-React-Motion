# lucide-react-motion

## 0.2.0

### Minor Changes

- e80a857: Add a `mode` prop for selecting which animation an icon plays.

  - **Four named modes:** `"draw"` (default — current behavior), `"pulse"`, `"spin"`, `"shake"`, `"bounce"`. All compose with the existing trigger/timing/leave-behavior/reduced-motion props.
  - **Signatures:** `mode="signature"` plays the icon's character animation. Initial set covers `heart` (lub-dub beat), `bell` (damped ring), `eye` (blink), `star` (twinkle), `sun` (slow rotate), `loader` (infinite spin). Icons without a registered signature fall back to `"draw"` and emit a one-time dev warning.
  - **Function form:** `mode={(ctx) => Variants}` for fully custom factories that receive the resolved timing context (`duration`, `delay`, `stagger`, `easing`, `repeat`, plus `iconName` and `index`).
  - **App-wide defaults:** new `mode?: ModeName | ModeFactory` on `MotionIconConfig`.
  - **Per-mode timing defaults:** each mode can declare its own preferred timing (e.g. `loader` defaults to `repeat: Infinity`), layered between `MotionIconConfig` and engine defaults so per-icon props always win.
  - **Tree-shaken signatures:** the codegen emits a per-icon side-import for icons that have a signature, so consumers only pay for the signatures of icons they actually use.

  New exported types: `Mode`, `ModeContext`, `ModeDefaults`, `ModeFactory`, `ModeName`.

  Fix: `MotionIconConfig` memoization previously keyed on `JSON.stringify(config)`, which silently collapsed function-valued props (`easing`, and now `mode`) to the same key. Replaced with an explicit dependency array, so inner providers correctly re-evaluate when only a function reference changes.

  Generated icon wrappers now carry an `iconName` prop and (where applicable) a `signature` prop. Per-icon prop types `Omit` both — direct consumers are unaffected.

  No breaking changes. Existing `<Heart />` with no `mode` prop renders identically to before.

## 0.1.0

### Minor Changes

- 979009b: Initial release: 1,700+ animated Lucide icons with hover/click/mount/in-view/parent-hover/manual triggers, MotionIconConfig for app-wide defaults, full Motion variant escape hatch, and RSC-safe `"use client"` boundaries.

/**
 * Public entry point for `lucide-react-motion`.
 *
 * Consumers import from `"lucide-react-motion"`. This module re-exports the
 * full public surface:
 *
 *   - Every Lucide icon as a typed React component (`Heart`, `HeartIcon`, ...)
 *   - The core <DrawIcon /> primitive
 *   - The <MotionIconConfig /> provider
 *   - All public types
 */

export {
  DrawIcon,
  MotionIconConfig,
  PARENT_HOVER_ATTR,
  type DrawIconProps,
  type IconNode,
  type MotionIconConfigValue,
  type MotionIconHandle,
  type OnLeave,
  type ReducedMotion,
  type Trigger,
} from "./engine";

export * from "./generated";

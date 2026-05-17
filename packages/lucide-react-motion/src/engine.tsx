"use client";

/**
 * The animation engine for `lucide-react-motion`.
 *
 * Generated per-icon components (`src/generated/*`) are thin wrappers around
 * `<DrawIcon />`. Users typically import the icon they want by name -
 * `import { Heart } from "lucide-react-motion"` - and never touch this file
 * directly. It is exported as the low-level escape hatch for consumers who
 * want to build their own icon from raw Lucide node data.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SVGAttributes,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  type Easing,
  type SVGMotionProps,
  type Variants,
} from "motion/react";
type LegacyAnimationControls = ReturnType<typeof useAnimation>;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Lucide's icon-node format: a tuple of [tagName, attrs]. */
export type IconNode = [tag: string, attrs: Record<string, string | number>];

export type Trigger =
  | "hover"
  | "click"
  | "mount"
  | "in-view"
  | "parent-hover"
  | "manual";

export type OnLeave = "complete" | "snap" | "redraw";

export type ReducedMotion = "system" | "always" | "never";

/**
 * Lifecycle phase the icon broadcasts via `data-motion-state` on the rendered
 * `<svg>`. Consumers style against it with CSS so host color/transforms can
 * stay in sync with the internal draw, even after a hover has ended.
 */
export type MotionState = "resting" | "drawing" | "complete";

/** Imperative handle exposed via `ref` when `trigger="manual"`. */
export interface MotionIconHandle {
  /** Play the active animation. */
  play: () => void;
  /** Snap back to the rest state. */
  reset: () => void;
  /** The underlying SVG element. */
  node: SVGSVGElement | null;
}

/** Subset of `DrawIconProps` that can be set globally via `<MotionIconConfig />`. */
export interface MotionIconConfigValue {
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: Easing | Easing[];
  repeat?: number;
  trigger?: Trigger;
  onLeave?: OnLeave;
  reducedMotion?: ReducedMotion;
}

/**
 * Props for `<DrawIcon />` and every generated icon component. Extends
 * React's standard SVG attributes so consumers retain access to `className`,
 * `style`, `onClick`, `aria-*`, and `data-*`.
 */
export interface DrawIconProps
  extends Omit<SVGAttributes<SVGSVGElement>, "ref" | "children"> {
  /** Lucide icon node array. Generated icons fill this in for you. */
  nodes: IconNode[];
  /** Pixel size of the icon. Default: 24. */
  size?: number;
  /** Stroke color. Default: `currentColor`. */
  color?: string;
  /** Stroke width. Default: 2. */
  strokeWidth?: number;
  /** When true, the stroke stays pixel-constant regardless of `size`. */
  absoluteStrokeWidth?: boolean;
  /** Animation duration in seconds. Default: 0.55. */
  duration?: number;
  /** Animation delay in seconds before each stroke draws. Default: 0. */
  delay?: number;
  /** Per-stroke delay increment (cascade). Default: 0.12. */
  stagger?: number;
  /** Motion easing. Accepts named curves or a cubic bezier tuple. */
  easing?: Easing | Easing[];
  /** Repeat count. `0` plays once, `Infinity` loops. Default: 0. */
  repeat?: number;
  /** When/how the animation fires. Default: `"hover"`. */
  trigger?: Trigger;
  /** Behavior when hover/parent-hover ends. Default: `"complete"`. */
  onLeave?: OnLeave;
  /** Respect, force on, or force off the OS reduced-motion preference. */
  reducedMotion?: ReducedMotion;
  /** Escape hatch: replace the default draw variants entirely. */
  variants?: Variants | ((index: number) => Variants);
  /** Imperative ref handle (React 19 ref-as-prop). */
  ref?: Ref<MotionIconHandle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SVG_BASE = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * For `trigger="parent-hover"`, the icon walks up the DOM to find the nearest
 * element carrying this attribute and binds to its hover events. Exported so
 * consumers can reference it without hardcoding the string.
 */
export const PARENT_HOVER_ATTR = "data-motion-icon-group";
const PARENT_HOVER_SELECTOR = `[${PARENT_HOVER_ATTR}]`;

const DEFAULTS = {
  size: 24,
  color: "currentColor",
  strokeWidth: 2,
  absoluteStrokeWidth: false,
  duration: 0.55,
  delay: 0,
  stagger: 0.12,
  easing: "easeInOut" as Easing,
  repeat: 0,
  trigger: "hover" as Trigger,
  onLeave: "complete" as OnLeave,
  reducedMotion: "system" as ReducedMotion,
} satisfies Required<MotionIconConfigValue>;

type DefaultKey = keyof typeof DEFAULTS;
type Resolved = { [K in DefaultKey]: (typeof DEFAULTS)[K] };

// ---------------------------------------------------------------------------
// Context provider for app-wide defaults
// ---------------------------------------------------------------------------

const MotionIconContext = createContext<MotionIconConfigValue | null>(null);

interface MotionIconConfigProps extends MotionIconConfigValue {
  children: ReactNode;
}

/**
 * Provides default props for every `<DrawIcon />` in the subtree. Per-icon
 * props always win; nested providers merge inner over outer.
 *
 * @example
 * <MotionIconConfig duration={0.3} trigger="hover">
 *   <App />
 * </MotionIconConfig>
 */
export function MotionIconConfig({
  children,
  ...config
}: MotionIconConfigProps) {
  const parent = useContext(MotionIconContext);

  // Serialize config as the memo key so the value's identity is stable across
  // renders unless an actual config value changed. Assumes primitive props -
  // which is the intended API; passing functions/objects would defeat the memo.
  const configKey = JSON.stringify(config);
  const value = useMemo<MotionIconConfigValue>(
    () => ({ ...parent, ...config }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parent, configKey]
  );

  return (
    <MotionIconContext.Provider value={value}>
      {children}
    </MotionIconContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Prop resolution: prop -> context -> built-in default
// ---------------------------------------------------------------------------

function resolveProps(
  props: DrawIconProps,
  ctx: MotionIconConfigValue
): Resolved {
  const out = {} as Resolved;
  const p = props as unknown as Record<DefaultKey, unknown>;
  const c = ctx as unknown as Record<DefaultKey, unknown>;
  for (const key of Object.keys(DEFAULTS) as DefaultKey[]) {
    const fromProps = p[key];
    const fromCtx = c[key];
    const value =
      fromProps !== undefined
        ? fromProps
        : fromCtx !== undefined
          ? fromCtx
          : DEFAULTS[key];
    // Safe: each DefaultKey resolves to its own typed slot in DEFAULTS.
    (out as Record<DefaultKey, unknown>)[key] = value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Default draw variants
// ---------------------------------------------------------------------------

interface TimingArgs {
  duration: number;
  delay: number;
  stagger: number;
  easing: Easing | Easing[];
  repeat: number;
}

function buildDrawVariants(index: number, t: TimingArgs): Variants {
  return {
    rest: { pathLength: 1, opacity: 1 },
    active: {
      pathLength: [0, 1],
      opacity: [0.25, 1],
      transition: {
        duration: t.duration,
        delay: t.delay + index * t.stagger,
        ease: t.easing,
        repeat: t.repeat,
        repeatType: "loop",
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Trigger plumbing
// ---------------------------------------------------------------------------

function applyLeave(controls: LegacyAnimationControls, mode: OnLeave): void {
  if (mode === "redraw") {
    controls.start("active");
  } else if (mode === "complete") {
    // Let the in-progress animation play out - explicit no-op.
  } else {
    // "snap": cancel the running animation and jump to rest.
    controls.start("rest", { duration: 0 });
  }
}

interface TriggerEffectsArgs {
  trigger: Trigger;
  onLeave: OnLeave;
  controls: LegacyAnimationControls;
  svgRef: RefObject<SVGSVGElement | null>;
  inView: boolean;
  isReduced: boolean;
  beginHover: () => void;
  endHover: () => void;
}

function useTriggerEffects({
  trigger,
  onLeave,
  controls,
  svgRef,
  inView,
  isReduced,
  beginHover,
  endHover,
}: TriggerEffectsArgs): void {
  // mount: fire once on first paint.
  useEffect(() => {
    if (isReduced) return;
    if (trigger === "mount") controls.start("active");
  }, [trigger, controls, isReduced]);

  // in-view: replay every time the icon scrolls back into view. Reset to rest
  // on exit so the keyframe array re-fires from 0 on the next entry.
  useEffect(() => {
    if (isReduced) return;
    if (trigger !== "in-view") return;
    if (inView) controls.start("active");
    else controls.start("rest", { duration: 0 });
  }, [trigger, inView, controls, isReduced]);

  // parent-hover: bind to mouseenter/mouseleave on the nearest ancestor that
  // carries [data-motion-icon-group]. Routes hover edges through the same
  // beginHover/endHover callbacks the `hover` trigger uses so motion-state
  // bookkeeping stays in one place.
  useEffect(() => {
    if (isReduced) return;
    if (trigger !== "parent-hover") return;
    const parent = svgRef.current?.closest(PARENT_HOVER_SELECTOR);
    if (!parent) return;
    const enter = () => beginHover();
    const leave = () => {
      endHover();
      applyLeave(controls, onLeave);
    };
    parent.addEventListener("mouseenter", enter);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [trigger, controls, isReduced, onLeave, svgRef, beginHover, endHover]);
}

type MotionProps = Pick<
  SVGMotionProps<"svg">,
  "initial" | "animate" | "onHoverStart" | "onHoverEnd"
>;

function getMotionProps(
  trigger: Trigger,
  onLeave: OnLeave,
  controls: LegacyAnimationControls,
  isReduced: boolean,
  beginHover: () => void,
  endHover: () => void
): MotionProps {
  if (isReduced) {
    return { initial: "rest", animate: "rest" };
  }
  if (trigger === "hover") {
    return {
      initial: "rest",
      animate: controls,
      onHoverStart: () => beginHover(),
      onHoverEnd: () => {
        endHover();
        applyLeave(controls, onLeave);
      },
    };
  }
  // mount, in-view, click, manual, parent-hover - all driven via controls.
  return { initial: "rest", animate: controls };
}

// ---------------------------------------------------------------------------
// DrawIcon
// ---------------------------------------------------------------------------

/**
 * The animated SVG primitive. Every generated icon component is a thin
 * wrapper that supplies its own `nodes` and forwards `ref` plus all props.
 *
 * @example
 * <Heart size={24} className="text-rose-500" />
 *
 * @example
 * // Imperative control via ref:
 * const iconRef = useRef<MotionIconHandle>(null);
 * <Heart trigger="manual" ref={iconRef} />
 * <button onClick={() => iconRef.current?.play()}>play</button>
 */
export function DrawIcon(props: DrawIconProps) {
  const { nodes, variants, className, style, onClick, ref, ...passthrough } =
    props;

  const ctx = useContext(MotionIconContext) ?? {};
  const r = resolveProps(props, ctx);

  // Lucide-parity: keep stroke pixel-constant when absoluteStrokeWidth is set.
  const effectiveStrokeWidth = r.absoluteStrokeWidth
    ? (r.strokeWidth * 24) / r.size
    : r.strokeWidth;

  const systemReduced = useReducedMotion();
  const isReduced =
    r.reducedMotion === "always" ||
    (r.reducedMotion !== "never" && !!systemReduced);

  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const inView = useInView(svgRef);

  // Broadcast lifecycle phase as `data-motion-state` so consumers can sync
  // host CSS (e.g. parent `hover:text-primary`) with the draw, which can
  // outlive the hover when `onLeave="complete"`.
  //
  // For hover-style triggers (`hover`, `parent-hover`) the `complete` state
  // only latches while the cursor is still over the trigger — once the user
  // leaves, the icon drops back to `resting` (either immediately if the draw
  // already finished, or as soon as it does). For one-shot triggers
  // (`mount`, `in-view`, `click`, `manual`) `complete` latches indefinitely
  // until the next trigger fires another draw.
  const [motionState, setMotionState] = useState<MotionState>("resting");
  const hoveringRef = useRef(false);
  const isHoverTrigger = r.trigger === "hover" || r.trigger === "parent-hover";
  const beginHover = useCallback(() => {
    hoveringRef.current = true;
    controls.start("active");
  }, [controls]);
  const endHover = useCallback(() => {
    hoveringRef.current = false;
    setMotionState((s) => (s === "complete" ? "resting" : s));
  }, []);
  const handleAnimationStart = (def: unknown) => {
    if (def === "active") setMotionState("drawing");
    else if (def === "rest") setMotionState("resting");
  };
  const handleAnimationComplete = (def: unknown) => {
    // Only `active` completion is meaningful here. Listening to `rest`
    // completion is unsafe: paths like `click` and `onLeave="snap"` fire a
    // synchronous `rest` followed by an `active`, and motion can deliver
    // the rest-complete event AFTER active-start has already set state to
    // "drawing" — clobbering it back to "resting" mid-draw. The rest-start
    // handler above already lands the state correctly for every reset path.
    if (def !== "active") return;
    if (isHoverTrigger && !hoveringRef.current) {
      // Hover-style triggers only keep the latched `complete` state while
      // the cursor remains over the target. Otherwise revert to resting so
      // host CSS detaches cleanly.
      setMotionState("resting");
    } else {
      setMotionState("complete");
    }
  };

  // Imperative handle for trigger="manual".
  useImperativeHandle<MotionIconHandle, MotionIconHandle>(
    ref,
    () => ({
      play: () => {
        controls.start("active");
      },
      reset: () => {
        controls.start("rest");
      },
      node: svgRef.current,
    }),
    [controls]
  );

  useTriggerEffects({
    trigger: r.trigger,
    onLeave: r.onLeave,
    controls,
    svgRef,
    inView,
    isReduced,
    beginHover,
    endHover,
  });

  const motionProps = getMotionProps(
    r.trigger,
    r.onLeave,
    controls,
    isReduced,
    beginHover,
    endHover
  );

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!isReduced && r.trigger === "click") {
      // Reset to rest synchronously so the active keyframe array re-fires
      // from its first frame on every click.
      controls.start("rest", { duration: 0 });
      controls.start("active");
    }
    onClick?.(e);
  };

  const mergedStyle: CSSProperties = {
    cursor: r.trigger === "click" ? "pointer" : undefined,
    ...style,
  };

  // Strip prop names we've already consumed so they don't leak onto the DOM.
  const cleanedPassthrough: Record<string, unknown> = {
    ...(passthrough as unknown as Record<string, unknown>),
  };
  for (const key of Object.keys(DEFAULTS) as DefaultKey[]) {
    delete cleanedPassthrough[key];
  }
  // Lifecycle handlers and the state attribute are owned by the engine. The
  // SVGAttributes base type makes these assignable from userland but they
  // collide with the motion-redefined callbacks of the same name, so swallow
  // any passthrough copies and let the engine's handlers be authoritative.
  delete cleanedPassthrough.onAnimationStart;
  delete cleanedPassthrough.onAnimationComplete;
  delete cleanedPassthrough["data-motion-state"];

  return (
    <motion.svg
      // Spreads first; explicit props after so our overrides always win.
      {...SVG_BASE}
      {...motionProps}
      {...cleanedPassthrough}
      ref={svgRef}
      width={r.size}
      height={r.size}
      stroke={r.color}
      strokeWidth={effectiveStrokeWidth}
      className={className}
      onClick={handleClick}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      data-motion-state={motionState}
      style={mergedStyle}
    >
      {nodes.map((node, i) => {
        const [Tag, attrs] = node;
        // motion is keyed by SVG tag name. Cast widens for dynamic lookup.
        const MotionTag =
          (motion as unknown as Record<string, ElementType>)[Tag] ??
          motion.path;
        // `variants` prop fully replaces the default draw motion. Accepts
        // either an object { rest, active } or a function (i) -> object.
        // Custom variants must still expose "rest" and "active" so the
        // trigger system works.
        const v: Variants =
          typeof variants === "function"
            ? variants(i)
            : (variants ?? buildDrawVariants(i, r));
        return <MotionTag key={i} {...attrs} variants={v} />;
      })}
    </motion.svg>
  );
}

DrawIcon.displayName = "DrawIcon";

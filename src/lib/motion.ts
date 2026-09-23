import type { MotionProps, TargetAndTransition, Transition } from 'framer-motion';

/*
 * Entrance animations shared across pages, taken from the home page so every
 * page feels part of the same site. Use them by role, and vary them down a
 * page rather than repeating one:
 *
 *   <motion.div {...reveal('clipUp')}>          // animates when scrolled into view
 *   <motion.aside {...enter('tilt3d', { delay: 0.15 })}>   // animates on page load
 *   {items.map((x, i) => <motion.li key={x} {...reveal('popSpring', { delay: i * 0.08 })}>)}
 *
 * Reduced-motion users get opacity-only fades (see <MotionConfig reducedMotion="user"> in main.tsx).
 */

export type Preset =
  | 'clipUp' // headline rises out of a mask (Home hero)
  | 'curtain' // drops down from behind a curtain (Home "Get in touch")
  | 'skewLeft' // slides in from the left with a slight skew (Home stage, about)
  | 'skewRight'
  | 'tilt3d' // tips up in 3D, like a card lifted off the table (Home results, hire form)
  | 'blurLeft' // slides in while coming into focus (Home Virtual CMO list)
  | 'blurRight'
  | 'popSpring' // springy pop, for stats and small tiles (Home stage stats)
  | 'riseScale' // rises and grows slightly (Home Virtual CMO card)
  | 'rotateLeft' // rises from a slight tilt, for alternating cards (Home stage videos)
  | 'rotateRight'
  | 'slideLeft' // plain slide from the side (Home trust bar)
  | 'slideRight'
  | 'zoomBlur'; // settles from slightly large and blurred, for images

const EASE = [0.16, 1, 0.3, 1] as const;

const PRESETS: Record<Preset, { hidden: TargetAndTransition; visible: TargetAndTransition; transition?: Transition }> = {
  clipUp: {
    hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
    visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' },
    transition: { duration: 0.75, ease: EASE },
  },
  curtain: {
    hidden: { opacity: 0, y: -30, clipPath: 'inset(0 0 100% 0)' },
    visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' },
    transition: { duration: 0.7, ease: EASE },
  },
  skewLeft: {
    hidden: { opacity: 0, x: -36, skewY: 1.5 },
    visible: { opacity: 1, x: 0, skewY: 0 },
    transition: { duration: 0.7, ease: EASE },
  },
  skewRight: {
    hidden: { opacity: 0, x: 36, skewY: -1.5 },
    visible: { opacity: 1, x: 0, skewY: 0 },
    transition: { duration: 0.7, ease: EASE },
  },
  tilt3d: {
    hidden: { opacity: 0, rotateX: 14, y: 48, scale: 0.97, transformPerspective: 900 },
    visible: { opacity: 1, rotateX: 0, y: 0, scale: 1, transformPerspective: 900 },
    transition: { duration: 0.75, ease: EASE },
  },
  blurLeft: {
    hidden: { opacity: 0, x: -28, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: EASE },
  },
  blurRight: {
    hidden: { opacity: 0, x: 28, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: EASE },
  },
  popSpring: {
    hidden: { opacity: 0, y: 24, scale: 0.85 },
    visible: { opacity: 1, y: 0, scale: 1 },
    transition: { type: 'spring', stiffness: 280, damping: 20 },
  },
  riseScale: {
    hidden: { opacity: 0, y: 50, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: EASE },
  },
  rotateLeft: {
    hidden: { opacity: 0, y: 32, rotate: -2 },
    visible: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: 0.6, ease: EASE },
  },
  rotateRight: {
    hidden: { opacity: 0, y: 32, rotate: 2 },
    visible: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: 0.6, ease: EASE },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: EASE },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: EASE },
  },
  zoomBlur: {
    hidden: { opacity: 0, scale: 1.08, filter: 'blur(6px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 0.8, ease: EASE },
  },
};

interface Options {
  delay?: number;
  /** Override the preset's duration (tween presets only). */
  duration?: number;
}

function variantsFor(preset: Preset, { delay = 0, duration }: Options) {
  const p = PRESETS[preset];
  const transition: Transition = { ...p.transition, delay, ...(duration && p.transition?.type !== 'spring' ? { duration } : {}) };
  return { hidden: p.hidden, visible: { ...p.visible, transition } };
}

/** Animates once when the element scrolls into view. */
export function reveal(preset: Preset, opts: Options = {}): MotionProps {
  return {
    variants: variantsFor(preset, opts),
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0 },
  };
}

/** Animates once on page load (for content already on screen, like a hero). */
export function enter(preset: Preset, opts: Options = {}): MotionProps {
  return {
    variants: variantsFor(preset, opts),
    initial: 'hidden',
    animate: 'visible',
  };
}

/** Alternates between two presets down a list, e.g. rotateLeft / rotateRight cards. */
export function alternate(a: Preset, b: Preset, index: number, step = 0.08): MotionProps {
  return reveal(index % 2 === 0 ? a : b, { delay: index * step });
}

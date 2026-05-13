'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useScroll,
  type MotionValue,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { SOFT_SPRING } from './Reveal';

/* ============================== Magnetic ================================
 * Subtle pull toward the cursor on hover. Used for primary CTAs to add a
 * tactile "premium" feel without breaking the existing button styles.
 * Honors prefers-reduced-motion (skips the effect).
 * ====================================================================== */
export function Magnetic({
  children,
  strength = 0.25,
  className,
  as: Tag = 'span',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  as?: 'span' | 'div';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = Tag === 'div' ? motion.div : motion.span;

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn('inline-block motion-reduce:!translate-x-0 motion-reduce:!translate-y-0', className)}
    >
      {children}
    </Component>
  );
}

/* ============================== TiltCard ================================
 * Cursor-driven 3D tilt. Lightweight (no library), framer-spring smoothed.
 * Apply to a card-like element you want to feel "tangible".
 * ====================================================================== */
export function TiltCard({
  children,
  max = 8,
  className,
  glare = false,
  style,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  glare?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.4 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useTransform(
    [gx, gy] as MotionValue<number>[],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.35) 0%, transparent 55%)`
  );

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={cn(
        'relative will-change-transform motion-reduce:!transform-none',
        className
      )}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-500 motion-reduce:!hidden"
          style={{
            background: glareBg,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}

/* ============================ AnimatedCounter ==========================
 * Tweens from 0 to `value` when scrolled into view (once).
 * Supports a `suffix` (e.g. "%", "min", "h") and a `format` callback.
 * ====================================================================== */
export function AnimatedCounter({
  value,
  duration = 1.6,
  suffix,
  prefix,
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      // easeOutQuart — fast then settles
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ============================== WordReveal =============================
 * Splits children into words and staggers them in. Works with inline
 * styles (italic spans etc.) — wrap the part you want animated.
 * ====================================================================== */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  y = 24,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={cn('inline', className)}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-baseline pb-[0.15em]"
        >
          <motion.span
            initial={{ y, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SOFT_SPRING, delay: delay + i * stagger }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ============================ ScrollProgress ===========================
 * Thin gradient bar pinned at the very top of the viewport that fills as
 * the user scrolls. Sits above the navigation.
 * ====================================================================== */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.5,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-sage via-accent to-sage motion-reduce:!hidden"
    />
  );
}

/* ============================== Parallax ===============================
 * Translates `children` on the Y axis based on the parent's scroll offset.
 * `range` is the [start, end] px range. Apply on inert visual layers.
 * ====================================================================== */
export function Parallax({
  children,
  offset = 80,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn('motion-reduce:!transform-none', className)}
    >
      {children}
    </motion.div>
  );
}

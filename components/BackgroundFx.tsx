'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND, BRAND_RGB } from '@/lib/colors';
import { cn } from '@/lib/utils';

/* ----------------------------- Drifting Blobs ---------------------------- */
/**
 * Three colored blurred blobs that slowly drift in opposite directions.
 * Drop-in inside any `relative overflow-hidden` section.
 */
export function DriftingBlobs({
  variant = 'cream',
  className,
}: {
  variant?: 'cream' | 'indigo' | 'noir';
  className?: string;
}) {
  const blobs =
    variant === 'cream'
      ? [
          { color: 'bg-sage/20', size: 'h-[520px] w-[520px]', from: { x: -80, y: -40 } },
          { color: 'bg-stone/40', size: 'h-[460px] w-[460px]', from: { x: 60, y: 80 } },
          { color: 'bg-moss/10', size: 'h-[380px] w-[380px]', from: { x: 100, y: -100 } },
        ]
      : variant === 'indigo'
        ? [
            { color: 'bg-cream/15', size: 'h-[520px] w-[520px]', from: { x: -60, y: -60 } },
            { color: 'bg-moss/30', size: 'h-[460px] w-[460px]', from: { x: 80, y: 60 } },
            { color: 'bg-cream/10', size: 'h-[380px] w-[380px]', from: { x: -120, y: 120 } },
          ]
        : [
            { color: 'bg-sage/30', size: 'h-[520px] w-[520px]', from: { x: -80, y: -80 } },
            { color: 'bg-cream/5', size: 'h-[420px] w-[420px]', from: { x: 100, y: 60 } },
            { color: 'bg-sage/20', size: 'h-[380px] w-[380px]', from: { x: -120, y: 140 } },
          ];

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          aria-hidden
          initial={{ x: b.from.x, y: b.from.y }}
          animate={{
            x: [b.from.x, b.from.x + (i % 2 ? -60 : 60), b.from.x],
            y: [b.from.y, b.from.y + (i === 1 ? -50 : 50), b.from.y],
          }}
          transition={{
            duration: 18 + i * 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          className={cn(
            'absolute rounded-full blur-[120px] motion-reduce:!animate-none',
            b.size,
            b.color,
            i === 0 && 'top-[-10%] left-[-10%]',
            i === 1 && 'bottom-[-10%] right-[-10%]',
            i === 2 && 'top-[40%] left-[40%]'
          )}
        />
      ))}
    </div>
  );
}

/* --------------------------- Mouse Spotlight ---------------------------- */
/**
 * A large blurred halo that follows the cursor. Hero-worthy.
 */
export function MouseSpotlight({ color = `rgba(${BRAND_RGB.sage}, 0.25)` }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      el.style.transform = `translate3d(${e.clientX - rect.left - 250}px, ${
        e.clientY - rect.top - 250
      }px, 0)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[120px] transition-transform duration-300 ease-out hidden lg:block motion-reduce:!hidden"
      style={{ background: color, willChange: 'transform' }}
    />
  );
}

/* ------------------------------ Dots Pattern ---------------------------- */
/**
 * Subtle SVG dots grid background. Animated via CSS pulse.
 */
export function DotsPattern({
  variant = 'sage',
  className,
}: {
  variant?: 'sage' | 'cream' | 'stone';
  className?: string;
}) {
  const fill =
    variant === 'cream' ? BRAND.cream : variant === 'stone' ? '#A8A08D' : BRAND.sage;

  return (
    <svg
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] motion-reduce:!animate-none',
        className
      )}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id={`dots-${variant}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill={fill} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dots-${variant})`} />
    </svg>
  );
}

/* ----------------------------- Floating Shapes -------------------------- */
/**
 * Small geometric shapes floating gently at fixed positions.
 */
type Shape = {
  type: 'square' | 'circle' | 'cross';
  className: string; // size + position
  color: string;
  duration: number;
  rotate?: boolean;
};

const defaultShapes: Shape[] = [
  { type: 'square', className: 'h-3 w-3 top-[12%] left-[18%]', color: 'bg-moss', duration: 7, rotate: true },
  { type: 'circle', className: 'h-3 w-3 top-[26%] right-[10%]', color: 'bg-accent', duration: 9 },
  { type: 'cross', className: 'h-4 w-4 top-[64%] left-[6%]', color: 'text-moss', duration: 8, rotate: true },
  { type: 'circle', className: 'h-3.5 w-3.5 bottom-[14%] right-[14%]', color: 'bg-sage/70', duration: 10 },
  { type: 'square', className: 'h-2 w-2 top-[78%] left-[62%]', color: 'bg-accent/80', duration: 8, rotate: true },
];

export function FloatingShapes({
  shapes = defaultShapes,
  className,
}: {
  shapes?: Shape[];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [0, -14, 0],
            rotate: s.rotate ? [0, 12, 0] : 0,
          }}
          transition={{
            duration: s.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.4,
          }}
          className={cn(
            'absolute motion-reduce:!animate-none',
            s.className,
            s.type === 'circle' && `rounded-full ${s.color}`,
            s.type === 'square' && `${s.color}`
          )}
        >
          {s.type === 'cross' && (
            <svg viewBox="0 0 16 16" className={cn('h-full w-full', s.color)}>
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* --------------------------- Floating Particles ------------------------- */
/**
 * Light atmospheric dots that drift slowly. Static positions (deterministic),
 * very small (2-4px), low opacity — adds life without visual noise.
 */
type Particle = {
  x: number; // %
  y: number; // %
  size: number; // px
  color: 'sage' | 'accent' | 'moss';
  opacity: number;
  duration: number;
  delay: number;
  drift: { x: number; y: number }; // px range
};

const particles: Particle[] = [
  { x: 8, y: 18, size: 4, color: 'sage', opacity: 0.55, duration: 18, delay: 0, drift: { x: 14, y: -10 } },
  { x: 22, y: 72, size: 3, color: 'accent', opacity: 0.65, duration: 22, delay: -3, drift: { x: -10, y: 16 } },
  { x: 38, y: 32, size: 2, color: 'moss', opacity: 0.4, duration: 16, delay: -6, drift: { x: 8, y: 12 } },
  { x: 54, y: 88, size: 5, color: 'sage', opacity: 0.45, duration: 24, delay: -2, drift: { x: -14, y: -10 } },
  { x: 12, y: 54, size: 2, color: 'accent', opacity: 0.55, duration: 20, delay: -8, drift: { x: 10, y: -16 } },
  { x: 70, y: 12, size: 3, color: 'sage', opacity: 0.5, duration: 19, delay: -1, drift: { x: -8, y: 12 } },
  { x: 86, y: 44, size: 4, color: 'accent', opacity: 0.6, duration: 23, delay: -4, drift: { x: -12, y: -8 } },
  { x: 92, y: 80, size: 2, color: 'sage', opacity: 0.45, duration: 17, delay: -7, drift: { x: 8, y: -10 } },
  { x: 64, y: 60, size: 3, color: 'moss', opacity: 0.35, duration: 21, delay: -5, drift: { x: -10, y: 14 } },
  { x: 30, y: 8, size: 3, color: 'sage', opacity: 0.5, duration: 18, delay: -9, drift: { x: 12, y: 10 } },
  { x: 46, y: 50, size: 2, color: 'accent', opacity: 0.7, duration: 16, delay: -2, drift: { x: 8, y: -12 } },
  { x: 78, y: 28, size: 3, color: 'moss', opacity: 0.4, duration: 22, delay: -6, drift: { x: -10, y: 8 } },
  { x: 6, y: 90, size: 4, color: 'sage', opacity: 0.45, duration: 25, delay: 0, drift: { x: 14, y: -8 } },
  { x: 50, y: 22, size: 2, color: 'accent', opacity: 0.55, duration: 20, delay: -3, drift: { x: -10, y: 10 } },
];

export function FloatingParticles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, p.drift.x, 0],
            y: [0, p.drift.y, 0],
          }}
          transition={{
            duration: p.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: p.delay,
          }}
          className={cn(
            'absolute rounded-full motion-reduce:!animate-none',
            p.color === 'sage' && 'bg-sage',
            p.color === 'accent' && 'bg-accent',
            p.color === 'moss' && 'bg-moss'
          )}
          style={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            height: p.size,
            width: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

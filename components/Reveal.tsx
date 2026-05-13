'use client';

import { motion, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared "soft spring" — gentle landing with a tiny overshoot.
 * Reuse on existing motion.div with `transition={{ ...SOFT_SPRING, delay }}`.
 */
export const SOFT_SPRING: Transition = {
  type: 'spring',
  stiffness: 110,
  damping: 16,
  mass: 0.55,
};

/**
 * Reveal-on-scroll wrapper. Animates from below with a tiny spring overshoot
 * for a "léger bounce" feel. Once revealed, stays visible (no replay).
 *
 * Honors `prefers-reduced-motion` automatically (framer-motion).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'li';
}) {
  const transition: Transition = { ...SOFT_SPRING, delay };

  const Component = motion[Tag] as typeof motion.div;

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={transition}
      className={className}
    >
      {children}
    </Component>
  );
}

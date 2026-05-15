'use client';

import { cn } from '@/lib/utils';

/**
 * Continuous horizontal marquee strip.
 * Doubles the items so the loop is seamless.
 */
export default function Marquee({
  items,
  variant = 'indigo',
  speed = 40,
}: {
  items: string[];
  variant?: 'indigo' | 'noir' | 'cream';
  speed?: number;
}) {
  if (!items || items.length === 0) return null;

  const palette =
    variant === 'noir'
      ? 'bg-moss text-cream border-y border-cream/10'
      : variant === 'cream'
        ? 'bg-cream text-sage border-y border-sage/15'
        : 'bg-sage text-cream border-y border-cream/10';

  const dotColor =
    variant === 'noir' ? 'bg-accent' : variant === 'cream' ? 'bg-sage/40' : 'bg-cream/50';

  // Repeat items 4x in the rendered track so that each half (which we
  // translate by -50%) already contains the loop content twice. Avoids
  // the 1-frame gap on resize.
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden py-2.5 select-none',
        palette
      )}
    >
      <div
        className="marquee-track motion-reduce:!animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-4 px-5 font-display text-lg md:text-xl lg:text-2xl tracking-tight whitespace-nowrap"
          >
            <span>{label}</span>
            <span
              className={cn('inline-block h-1 w-1 rounded-full flex-shrink-0', dotColor)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

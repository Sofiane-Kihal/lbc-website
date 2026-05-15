'use client';

import { cn } from '@/lib/utils';
import type { LogoItem } from '@/lib/defaults';

export default function LogoMarquee({
  logos,
  speed = 50,
  variant = 'indigo',
}: {
  logos: LogoItem[];
  speed?: number;
  variant?: 'cream' | 'noir' | 'indigo';
}) {
  if (!logos || logos.length === 0) return null;

  const palette =
    variant === 'noir'
      ? 'bg-moss text-cream/85 border-y border-cream/10'
      : variant === 'indigo'
        ? 'bg-sage text-cream/90 border-y border-cream/10'
        : 'bg-cream text-sage/85 border-y border-sage/15';

  // Repeat 4x for seamless loop with translateX(-50%)
  const repeated = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      aria-label="Ils nous font confiance"
      className={cn('relative overflow-hidden py-2.5 grain', palette)}
    >
      {/* Edge fades */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-r',
          variant === 'cream' && 'from-cream to-transparent',
          variant === 'noir' && 'from-moss to-transparent',
          variant === 'indigo' && 'from-sage to-transparent'
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l',
          variant === 'cream' && 'from-cream to-transparent',
          variant === 'noir' && 'from-moss to-transparent',
          variant === 'indigo' && 'from-sage to-transparent'
        )}
      />

      <div
        className="marquee-track motion-reduce:!animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((logo, i) => {
          const mono = logo.monochrome ?? true;
          return (
            <span
              key={i}
              className="flex items-center gap-3 px-8 md:px-12 whitespace-nowrap select-none"
            >
              {logo.image ? (
                <img
                  src={logo.image}
                  alt={logo.name || ''}
                  className="h-7 md:h-9 w-auto object-contain"
                  style={
                    mono
                      ? { filter: 'brightness(0) invert(1)', opacity: 0.9 }
                      : undefined
                  }
                />
              ) : (
                <span className="font-display italic text-xl md:text-2xl lg:text-3xl leading-none">
                  {logo.name}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </section>
  );
}

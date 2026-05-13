'use client';

import { cn } from '@/lib/utils';

type LogoStyle = 'serif' | 'sans-bold' | 'sans-light' | 'mono';

type Logo = {
  name: string;
  style?: LogoStyle;
  mark?: string; // small ornament before the wordmark
};

/**
 * Placeholder client wordmarks. Replace `defaultLogos` (or pass `logos`)
 * with the real client list once you have authorisations.
 */
const defaultLogos: Logo[] = [
  { name: 'Maison Laurel', style: 'serif' },
  { name: 'ORSO', style: 'sans-bold', mark: '◆' },
  { name: 'STUDIO VOLT', style: 'sans-bold' },
  { name: 'Impact Media', style: 'serif', mark: '✦' },
  { name: 'BLOOM', style: 'sans-bold' },
  { name: 'Altéa', style: 'serif' },
  { name: 'ATELIER 33', style: 'sans-light', mark: '/' },
  { name: 'Noir & Sel', style: 'serif' },
  { name: 'KAPSULE', style: 'mono' },
  { name: 'Horizon Co.', style: 'sans-light', mark: '·' },
  { name: 'NORD/SUD', style: 'sans-bold' },
  { name: 'Soft Lab', style: 'serif', mark: '○' },
];

function styleFor(style?: LogoStyle) {
  switch (style) {
    case 'serif':
      return 'font-display italic';
    case 'sans-bold':
      return 'font-body font-bold tracking-tight uppercase';
    case 'sans-light':
      return 'font-body font-light tracking-[0.18em] uppercase';
    case 'mono':
      return 'font-body font-medium tracking-[0.4em] uppercase';
    default:
      return 'font-body font-semibold';
  }
}

export default function LogoMarquee({
  logos = defaultLogos,
  speed = 50,
  variant = 'indigo',
}: {
  logos?: Logo[];
  speed?: number;
  variant?: 'cream' | 'noir' | 'indigo';
}) {
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
      aria-hidden
      className={cn('relative overflow-hidden py-5 grain', palette)}
    >
      {/* Edge fades */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-r',
          variant === 'cream' && 'from-cream to-transparent',
          variant === 'noir' && 'from-moss to-transparent',
          variant === 'indigo' && 'from-sage to-transparent'
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-l',
          variant === 'cream' && 'from-cream to-transparent',
          variant === 'noir' && 'from-moss to-transparent',
          variant === 'indigo' && 'from-sage to-transparent'
        )}
      />

      <div
        className="marquee-track motion-reduce:!animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((logo, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-10 md:px-14 whitespace-nowrap select-none"
          >
            {logo.mark && (
              <span className="text-2xl opacity-60">{logo.mark}</span>
            )}
            <span
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl leading-none',
                styleFor(logo.style)
              )}
            >
              {logo.name}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

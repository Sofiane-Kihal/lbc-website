// Single source of truth for brand colors.
// When refreshing the palette, change values here — Tailwind tokens,
// CSS variables (globals.css), and gradient presets all derive from this file.

export const BRAND = {
  sage: '#4F60F1',
  sage700: '#3A46C5',
  cream: '#FAF1E6',
  stone: '#C7C0AE',
  moss: '#010101',
  accent: '#FF6B35',
} as const;

// Comma-separated RGB tuples for rgba() — kept in sync with BRAND above.
// Mirrored as `--sage-rgb` in globals.css for use inside Tailwind arbitrary
// values (`shadow-[0_8px_30px_rgba(var(--sage-rgb),0.08)]`).
export const BRAND_RGB = {
  sage: '79, 96, 241',
} as const;

// Full sage scale consumed by tailwind.config.ts. Shades other than
// 600/700 are kept close to the previous palette since the visual delta
// from the previous base is small.
export const SAGE_SCALE = {
  DEFAULT: BRAND.sage,
  50: '#EEF0FE',
  100: '#DCE0FD',
  200: '#B9C2FB',
  300: '#96A4F9',
  400: '#7385F6',
  500: '#6678F4',
  600: BRAND.sage,
  700: BRAND.sage700,
  800: '#2E3A98',
  900: '#1D2867',
} as const;

// Gradient presets used as `Project.cover` values (`gradient:sage→moss`, …).
// Consumed by Hero, ProjectsGrid, the public project page and the admin editor.
export const COVER_GRADIENTS: Record<string, string> = {
  'gradient:sage→moss': `linear-gradient(135deg, ${BRAND.sage} 0%, ${BRAND.moss} 100%)`,
  'gradient:moss→stone': `linear-gradient(135deg, ${BRAND.moss} 0%, ${BRAND.stone} 100%)`,
  'gradient:sage→stone': `linear-gradient(135deg, ${BRAND.sage} 0%, ${BRAND.stone} 100%)`,
  'gradient:stone→cream': `linear-gradient(135deg, ${BRAND.stone} 0%, ${BRAND.cream} 100%)`,
  'gradient:moss→sage': `linear-gradient(135deg, ${BRAND.moss} 0%, ${BRAND.sage} 100%)`,
  'gradient:sage→cream': `linear-gradient(135deg, ${BRAND.sage} 0%, ${BRAND.cream} 100%)`,
};

export const COVER_PRESETS = Object.keys(COVER_GRADIENTS);

const FALLBACK_GRADIENT = COVER_GRADIENTS['gradient:sage→moss'];

export function coverStyle(cover: string | undefined) {
  if (!cover) return { backgroundImage: FALLBACK_GRADIENT };
  if (cover.startsWith('gradient:')) {
    return { backgroundImage: COVER_GRADIENTS[cover] || FALLBACK_GRADIENT };
  }
  if (cover.startsWith('http') || cover.startsWith('/')) {
    return {
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { backgroundImage: FALLBACK_GRADIENT };
}

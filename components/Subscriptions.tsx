'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import type { Subscription } from '@/lib/defaults';
import { cn } from '@/lib/utils';
import { DriftingBlobs, DotsPattern } from './BackgroundFx';
import Reveal, { SOFT_SPRING } from './Reveal';

// Realistic, employer-cost reference for a junior in-house CM in France:
// 28–32k brut/year × ~1.45 (charges) ≈ 40–46k/year → ~3 400–3 850€/month.
// Plus equipment, software, onboarding, management overhead pushes it to
// ~3 800–4 500€/month before the candidate even produces content.
const CDI_RANGE = '3 800 — 4 500 €';

export default function Subscriptions({
  items,
  onChoose,
}: {
  items: Subscription[];
  onChoose: (sub: Subscription) => void;
}) {
  const cards = items.filter((s) => !s.compact);
  const compact = items.filter((s) => s.compact);

  // Cheapest & most expensive "subscription + CM" combos, for the comparison.
  const totalsRange = (() => {
    const totals = cards
      .map((s) => parsePrice(s.price) + (s.addon ? parsePrice(s.addon.price) : 0))
      .filter((n) => n > 0);
    if (totals.length === 0) return null;
    const min = Math.min(...totals);
    const max = Math.max(...totals);
    return { min, max };
  })();

  // Pick the most balanced grid for the count of main cards.
  const gridCols =
    cards.length === 3
      ? 'md:grid-cols-3 max-w-5xl mx-auto'
      : cards.length === 2
        ? 'md:grid-cols-2 max-w-3xl mx-auto'
        : cards.length === 4
          ? 'md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'
          : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';

  return (
    <section id="abonnements" className="section-pad relative overflow-hidden bg-cream text-sage">
      <DriftingBlobs variant="cream" />
      <DotsPattern variant="sage" className="opacity-[0.06]" />
      <div className="container-wide relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-6xl text-sage leading-[1.05]">
              Pour aller{' '}
              <span className="italic text-accent">plus loin, ensemble</span>
            </h2>
            <p className="mt-5 text-sage/70 text-lg">
              Des packs mensuels pour les marques qui ont un{' '}
              <strong className="text-sage">propos clair</strong> et une stratégie
              cadrée — la vôtre, ou celle qu'on construit en amont via un audit / une
              stratégie à la carte. Régularité, attention au détail, ajustement.
            </p>
          </div>
        </Reveal>

        {/* BD bubble — "vous ne gérez rien" */}
        <HandsOffBubble />

        {/* Main subscription cards */}
        <div className={cn('grid gap-5 md:gap-6 grid-cols-1 mt-14', gridCols)}>
          {cards.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SOFT_SPRING, delay: i * 0.06 }}
              whileHover={{ y: s.featured ? -4 : -6 }}
              className={cn(
                'group relative rounded-3xl p-7 md:p-8 flex flex-col transition-shadow duration-500 overflow-hidden',
                s.featured
                  ? 'bg-sage text-cream shadow-2xl shadow-sage/30 lg:scale-105 lg:-my-2'
                  : 'card-soft hover:shadow-[0_24px_60px_rgba(var(--sage-rgb),0.18)]'
              )}
            >
              {/* Featured: soft pulsing halo behind */}
              {s.featured && (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-cream/10 blur-2xl -z-10 motion-reduce:!animate-none"
                />
              )}

              {/* Featured: integrated editorial marker */}
              {s.featured && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SOFT_SPRING, delay: i * 0.06 + 0.2 }}
                  className="flex items-center gap-2.5 mb-5 relative"
                >
                  <span className="relative inline-flex h-2 w-2 flex-shrink-0">
                    <motion.span
                      aria-hidden
                      animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full bg-accent motion-reduce:!animate-none"
                    />
                    <span className="relative inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(255,107,53,0.6)]" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                    Le plus choisi
                  </span>
                </motion.div>
              )}

              <h3
                className={cn(
                  'font-display text-2xl leading-tight',
                  s.featured ? 'text-cream' : 'text-sage'
                )}
              >
                {s.name}
              </h3>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span
                  className={cn(
                    'font-display text-5xl',
                    s.featured ? 'text-cream' : 'text-sage'
                  )}
                >
                  {s.price}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    s.featured ? 'text-cream/70' : 'text-sage/50'
                  )}
                >
                  HT {s.cadence}
                </span>
              </div>

              <div
                className={cn(
                  'mt-6 h-px',
                  s.featured ? 'bg-cream/15' : 'bg-sage/10'
                )}
              />

              <ul className="mt-6 space-y-2.5 flex-1 relative">
                {s.bullets.map((b, j) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ ...SOFT_SPRING, delay: i * 0.06 + 0.2 + j * 0.04 }}
                    className={cn(
                      'flex items-start gap-3 text-[14px]',
                      s.featured ? 'text-cream/90' : 'text-sage/80'
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'mt-[10px] h-px flex-shrink-0 transition-all duration-500',
                        s.featured
                          ? 'w-3 bg-cream/60'
                          : 'w-3 bg-accent/70 group-hover:w-5'
                      )}
                    />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Per-formula CM add-on */}
              {s.addon && (
                <div
                  className={cn(
                    'mt-6 rounded-2xl border px-4 py-3 flex items-center gap-3',
                    s.featured
                      ? 'border-cream/20 bg-cream/[0.06]'
                      : 'border-sage/15 bg-sage/[0.04]'
                  )}
                >
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-full flex-shrink-0',
                      s.featured ? 'bg-cream/15 text-cream' : 'bg-accent/15 text-accent'
                    )}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-[13px] font-medium leading-tight',
                        s.featured ? 'text-cream' : 'text-sage'
                      )}
                    >
                      {s.addon.name}
                    </div>
                    <div
                      className={cn(
                        'text-[11px] mt-0.5',
                        s.featured ? 'text-cream/65' : 'text-sage/55'
                      )}
                    >
                      Optionnel · ajoutez-le au panier
                    </div>
                  </div>
                  <div
                    className={cn(
                      'font-display text-lg whitespace-nowrap flex-shrink-0',
                      s.featured ? 'text-cream' : 'text-sage'
                    )}
                  >
                    +{s.addon.price}
                    <span
                      className={cn(
                        'text-[10px] ml-1',
                        s.featured ? 'text-cream/60' : 'text-sage/50'
                      )}
                    >
                      HT {s.cadence}
                    </span>
                  </div>
                </div>
              )}

              <motion.button
                onClick={() => onChoose(s)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={SOFT_SPRING}
                className={cn(
                  'mt-6 rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2',
                  s.featured
                    ? 'bg-cream text-sage hover:bg-cream/90'
                    : 'bg-sage text-cream hover:bg-sage-700'
                )}
              >
                Choisir cet abonnement
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Salary comparison — credibility / value closer */}
        {totalsRange && <SalaryComparison range={totalsRange} />}

        {/* Compact options block (kept for backwards compat — empty by default now) */}
        {compact.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SOFT_SPRING, delay: 0.1 }}
            className="mt-12 max-w-3xl mx-auto card-soft p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-5">
              <h3 className="font-display text-2xl text-sage">Options à la carte</h3>
              <p className="text-sm text-sage/60">
                À ajouter à n'importe quel abonnement, ou en standalone.
              </p>
            </div>
            <ul className="divide-y divide-sage/10">
              {compact.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sage">{s.name}</div>
                    {s.bullets.length > 0 && (
                      <div className="text-xs text-sage/55 mt-0.5">
                        {s.bullets.join(' · ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <div className="font-display text-lg text-sage whitespace-nowrap">
                      {s.price}
                      <span className="text-xs text-sage/50 ml-1">
                        HT {s.cadence}
                      </span>
                    </div>
                    <button
                      onClick={() => onChoose(s)}
                      className="rounded-full bg-sage/8 hover:bg-sage hover:text-cream text-sage px-4 py-1.5 text-xs font-medium transition-colors flex-shrink-0"
                    >
                      Choisir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* -------------------------- BD speech bubble ----------------------------- */
function HandsOffBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...SOFT_SPRING, delay: 0.05 }}
      className="relative max-w-xl mx-auto mt-2"
    >
      <motion.div
        animate={{ y: [0, -4, 0], rotate: [-0.5, 0.6, -0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[28px] bg-sage text-cream px-6 py-5 md:px-7 md:py-6 shadow-[0_18px_50px_rgba(var(--sage-rgb),0.30)] motion-reduce:!animate-none"
      >
        {/* Tail pointing down toward the cards */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-12 h-5 w-5 rotate-45 bg-sage rounded-[4px]"
        />
        {/* Comic 'thought' bubbles trailing down */}
        <motion.span
          aria-hidden
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-6 left-8 h-2 w-2 rounded-full bg-sage/85 motion-reduce:!hidden"
        />
        <motion.span
          aria-hidden
          animate={{ y: [0, 3, 0] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
          className="absolute -bottom-10 left-5 h-1.5 w-1.5 rounded-full bg-sage/70 motion-reduce:!hidden"
        />

        <div className="flex items-center gap-2 mb-2.5">
          <motion.span
            animate={{ rotate: [0, 18, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex text-accent motion-reduce:!animate-none"
          >
            <Sparkles size={14} />
          </motion.span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            Le confort
          </span>
        </div>
        <p className="font-display text-2xl md:text-[26px] leading-[1.15]">
          Vous ne gérez{' '}
          <span className="italic text-accent">rien</span>.
        </p>
        <p className="mt-3 text-cream/85 text-[14px] leading-relaxed">
          On se déplace pour shooter vos stories, on monte avec soin, on publie, on
          répond. De A à Z, c'est notre affaire — vous gardez votre temps pour faire
          ce que vous savez faire mieux que quiconque. Vous validez. Point.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------- Salary comparison closer ---------------------------- */
function SalaryComparison({ range }: { range: { min: number; max: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={SOFT_SPRING}
      className="mt-16 max-w-5xl mx-auto relative"
    >
      <div className="relative rounded-3xl bg-sage text-cream px-6 py-8 md:px-10 md:py-10 overflow-hidden shadow-[0_24px_60px_rgba(var(--sage-rgb),0.25)]">
        <div className="absolute inset-0 grain pointer-events-none opacity-50" />
        <motion.span
          aria-hidden
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-24 -right-24 h-[280px] w-[280px] rounded-full bg-accent/25 blur-[100px] motion-reduce:!animate-none"
        />

        <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center">
          {/* Left — CDI cost */}
          <div className="text-left md:text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cream/55">
              Un CM junior en CDI
            </div>
            <div className="mt-3 font-display text-3xl md:text-4xl leading-none text-cream/85">
              {CDI_RANGE}
              <span className="text-base text-cream/55 ml-1">/ mois</span>
            </div>
            <div className="mt-3 text-[13px] text-cream/65 leading-relaxed md:max-w-[260px] md:ml-auto">
              Salaire brut + charges patronales + matériel + onboarding et management.
              Une seule personne, une seule expertise.
            </div>
          </div>

          {/* Middle "vs" */}
          <div className="flex md:flex-col items-center gap-3 md:gap-2">
            <span className="hidden md:block h-12 w-px bg-cream/20" />
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent motion-reduce:!animate-none"
            >
              vs
            </motion.span>
            <span className="hidden md:block h-12 w-px bg-cream/20" />
          </div>

          {/* Right — Our formulas */}
          <div className="text-left">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
              La Bande Créative
            </div>
            <div className="mt-3 font-display text-3xl md:text-4xl leading-none text-cream">
              {formatEuros(range.min)} — {formatEuros(range.max)}
              <span className="text-base text-cream/55 ml-1">/ mois</span>
            </div>
            <div className="mt-3 text-[13px] text-cream/80 leading-relaxed md:max-w-[300px]">
              <strong className="text-cream">Tout inclus</strong> : direction artistique,
              tournage, montage, écoute des commentaires, indicateurs. Une équipe
              complète, des regards qui s'additionnent, du matériel pro — et zéro
              gestion RH.
            </div>
          </div>
        </div>

        {/* Punchline */}
        <div className="relative mt-8 pt-6 border-t border-cream/15 text-center">
          <p className="font-display text-xl md:text-2xl text-cream leading-snug">
            Un{' '}
            <span className="italic text-accent">studio entier</span>
            {' '}pour le prix d'un seul salarié.
          </p>
          <p className="mt-2 text-xs text-cream/55 italic max-w-xl mx-auto">
            Estimation coût employeur d'un CM junior en France (brut chargé + matériel +
            management) — fourchette basse à haute.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* --------------------------- Utilities ---------------------------------- */
function parsePrice(p: string): number {
  // Tolerate spaces, NBSPs, '€', commas, etc. Returns 0 if unparseable.
  const cleaned = p
    .replace(/\s| /g, '')
    .replace(/[€$,]/g, '')
    .replace(/,/g, '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatEuros(n: number): string {
  return `${n.toLocaleString('fr-FR')} €`;
}

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Subscription } from '@/lib/defaults';
import { cn } from '@/lib/utils';
import { DriftingBlobs, DotsPattern } from './BackgroundFx';
import Reveal, { SOFT_SPRING } from './Reveal';

export default function Subscriptions({
  items,
  onChoose,
}: {
  items: Subscription[];
  onChoose: (sub: Subscription) => void;
}) {
  const cards = items.filter((s) => !s.compact);
  const compact = items.filter((s) => s.compact);

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
    <section id="abonnements" className="section-pad relative overflow-hidden">
      <DriftingBlobs variant="cream" />
      <DotsPattern variant="sage" className="opacity-[0.06]" />
      <div className="container-wide relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow text-sage">
              <span className="eyebrow-num">05</span>
              <span className="eyebrow-rule" />
              <span className="eyebrow-label">En accompagnement</span>
            </div>
            <h2 className="font-display mt-4 text-4xl md:text-6xl text-sage leading-[1.05]">
              Pour aller{' '}
              <span className="italic text-accent">plus loin, ensemble</span>
            </h2>
            <p className="mt-5 text-sage/70 text-lg">
              Des packs mensuels pour les marques qui ont une{' '}
              <strong className="text-sage">stratégie cadrée</strong> — la vôtre, ou
              celle qu'on construit en amont via un audit / une stratégie à la carte.
              Régularité, mesure, ajustement.
            </p>
          </div>
        </Reveal>

        {/* Main subscription cards */}
        <div className={cn('grid gap-5 md:gap-6 grid-cols-1', gridCols)}>
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
                  : 'card-soft hover:shadow-[0_24px_60px_rgba(93,110,244,0.18)]'
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

              {/* Hover sheen */}
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[700%] transition-transform duration-[1300ms] ease-out motion-reduce:!hidden',
                  !s.featured && 'via-sage/10'
                )}
              />

              {/* Featured: integrated editorial marker — pulsing dot + tracked accent label */}
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

              <motion.button
                onClick={() => onChoose(s)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={SOFT_SPRING}
                className={cn(
                  'mt-7 rounded-full px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2',
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

        {/* Options à la carte — community add-ons */}
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

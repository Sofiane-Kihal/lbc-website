'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PricingGroup, PricingItem } from '@/lib/defaults';
import { cn } from '@/lib/utils';
import { DriftingBlobs } from './BackgroundFx';
import Reveal, { SOFT_SPRING } from './Reveal';

function PricingCard({ item, idx }: { item: PricingItem; idx: number }) {
  const hasTiers = !!(item.tiers && item.tiers.length > 0);
  const [tier, setTier] = useState(0);
  const displayPrice = hasTiers ? item.tiers![tier].price : item.price;
  const tierGroupId = `tier-${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SOFT_SPRING, delay: idx * 0.04 }}
      whileHover={{ y: -5 }}
      className="card-soft bg-cream/95 p-6 md:p-7 flex flex-col group relative overflow-hidden"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-sage/10 to-transparent translate-x-[-200%] group-hover:translate-x-[700%] transition-transform duration-[1300ms] ease-out motion-reduce:!hidden"
      />

      <h3 className="font-display text-2xl text-sage leading-tight relative">{item.name}</h3>
      {item.highlight && (
        <div className="mt-2 inline-flex items-center gap-2.5 relative">
          <span className="h-px w-5 bg-accent" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
            {item.highlight}
          </span>
        </div>
      )}

      {hasTiers && (
        <div className="mt-4 inline-flex items-center gap-1 p-1 rounded-full bg-sage/8 border border-sage/15 self-start relative">
          {item.tiers!.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTier(i)}
              className={cn(
                'relative rounded-full text-xs font-medium px-3 py-1.5 transition-colors duration-300',
                tier === i ? 'text-cream' : 'text-sage/70 hover:text-sage'
              )}
            >
              {tier === i && (
                <motion.span
                  layoutId={tierGroupId}
                  transition={{ ...SOFT_SPRING, stiffness: 320, damping: 26 }}
                  className="absolute inset-0 rounded-full bg-sage shadow-sm shadow-sage/30"
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-baseline gap-2 min-h-[44px] relative">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ ...SOFT_SPRING, delay: 0 }}
            className="font-display text-4xl text-sage"
          >
            {displayPrice}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm text-sage/50">HT</span>
      </div>

      {item.bullets.length > 0 && (
        <ul className="mt-5 space-y-2 relative">
          {item.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...SOFT_SPRING, delay: idx * 0.04 + 0.15 + i * 0.035 }}
              className="flex items-start gap-3 text-[14px] text-sage/80"
            >
              <span
                aria-hidden
                className="mt-[10px] h-px w-3 flex-shrink-0 bg-accent/70 group-hover:w-5 transition-all duration-500"
              />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default function Pricing({ groups }: { groups: PricingGroup[] }) {
  const [active, setActive] = useState(groups[0]?.id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <section
      id="tarifs"
      className="section-pad relative bg-sage text-cream overflow-hidden grain"
    >
      <DriftingBlobs variant="indigo" />

      <div className="container-wide relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-6 mb-12">
            <div>
              <div className="eyebrow text-cream">
                <span className="eyebrow-num">04</span>
                <span className="eyebrow-rule" />
                <span className="eyebrow-label">À la carte</span>
              </div>
              <h2 className="font-display mt-4 text-4xl md:text-6xl leading-[1.05]">
                Nos grilles{' '}
                <span className="italic text-cream/70">tarifaires</span>
              </h2>
            </div>

            {/* Editorial side-note — owns the indigo background with subtle glass */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SOFT_SPRING, delay: 0.15 }}
              className="relative max-w-sm self-start md:self-end rounded-2xl bg-cream/[0.06] backdrop-blur-sm border border-cream/15 px-6 py-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <motion.span
                    aria-hidden
                    animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-accent motion-reduce:!animate-none"
                  />
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                  À savoir
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-cream/85">
                Des prestations <strong className="text-cream">indépendantes</strong>,
                pour quand vous savez exactement ce dont vous avez besoin. Chaque ligne
                se commande seule, sans engagement régulier ni stratégie incluse.
              </p>
            </motion.aside>
          </div>
        </Reveal>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={cn(
                'relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300',
                active === g.id
                  ? 'text-sage'
                  : 'text-cream hover:text-cream border border-cream/15 bg-cream/10 hover:bg-cream/20'
              )}
            >
              {active === g.id && (
                <motion.span
                  layoutId="pricing-tab"
                  transition={{ ...SOFT_SPRING, stiffness: 280, damping: 26 }}
                  className="absolute inset-0 rounded-full bg-cream shadow-md shadow-moss/30"
                />
              )}
              <span className="relative z-10">{g.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {current?.description && (
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mb-8 text-cream/75 italic"
            >
              {current.description}
            </motion.p>
          )}
        </AnimatePresence>

        {(() => {
          const cards = (current?.items ?? []).filter((i) => !i.compact);
          const compact = (current?.items ?? []).filter((i) => i.compact);
          // Pick the most balanced layout for the card count.
          const gridCols =
            cards.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:max-w-4xl lg:mx-auto'
              : cards.length === 2
                ? 'grid-cols-1 md:grid-cols-2 lg:max-w-3xl lg:mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
              {cards.length > 0 && (
                <div className={cn('grid gap-5 md:gap-6', gridCols)}>
                  {cards.map((item, i) => (
                    <PricingCard key={item.id} item={item} idx={i} />
                  ))}
                </div>
              )}

              {compact.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 card-soft bg-cream/95 p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-5">
                    <h3 className="font-display text-2xl text-sage">
                      Options à la carte
                    </h3>
                    <p className="text-sm text-sage/60">
                      Pour personnaliser votre tournage. Tarifs HT.
                    </p>
                  </div>
                  <ul className="divide-y divide-sage/10">
                    {compact.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-sage">{item.name}</div>
                          {item.highlight && (
                            <div className="text-xs text-sage/55 mt-0.5">
                              {item.highlight}
                            </div>
                          )}
                        </div>
                        <div className="font-display text-lg text-sage whitespace-nowrap flex-shrink-0">
                          {item.price}
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              </motion.div>
            </AnimatePresence>
          );
        })()}

        {/* Pedagogical note */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-cream/85 text-sm md:text-base leading-relaxed">
            Ces tarifs donnent un{' '}
            <strong className="text-cream">ordre de grandeur</strong>. Votre projet réel
            donne toujours lieu à un devis sur-mesure, ajusté à votre objectif et à
            votre budget — on n'aime pas vendre des packages figés.
          </p>
        </div>
      </div>
    </section>
  );
}

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
  const tierBullets = hasTiers ? item.tiers![tier]?.bullets : undefined;
  const displayBullets =
    tierBullets && tierBullets.length > 0 ? tierBullets : item.bullets;
  const bulletsKey = hasTiers
    ? `${item.id}-${tier}-${displayBullets.length}`
    : item.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SOFT_SPRING, delay: idx * 0.04 }}
      whileHover={{ y: -5 }}
      className="card-soft bg-cream/95 p-6 md:p-7 flex flex-col group relative overflow-hidden"
    >
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
        <>
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

          {item.tiers![tier]?.description && (
            <div className="mt-2 min-h-[18px] relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.tiers![tier].description}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block text-xs italic text-sage/65"
                >
                  {item.tiers![tier].description}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </>
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

      {displayBullets.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.ul
            key={bulletsKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 space-y-2 relative"
          >
            {displayBullets.map((b, i) => (
              <motion.li
                key={`${b}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SOFT_SPRING, delay: 0.05 + i * 0.035 }}
                className="flex items-start gap-3 text-[14px] text-sage/80"
              >
                <span
                  aria-hidden
                  className="mt-[10px] h-px w-3 flex-shrink-0 bg-accent/70 group-hover:w-5 transition-all duration-500"
                />
                <span>{b}</span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* --------------------- Cards layout per count --------------------------- */
function CardsLayout({ cards }: { cards: PricingItem[] }) {
  // Special case: 5 cards → row of 3, then row of 2 centered below. Avoids
  // the lonely "3+2 left-aligned" feel of a plain 3-col grid.
  if (cards.length === 5) {
    return (
      <div className="space-y-5 md:space-y-6">
        <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {cards.slice(0, 3).map((item, i) => (
            <PricingCard key={item.id} item={item} idx={i} />
          ))}
        </div>
        <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto">
          {cards.slice(3).map((item, i) => (
            <PricingCard key={item.id} item={item} idx={i + 3} />
          ))}
        </div>
      </div>
    );
  }

  // Other counts — pick the most balanced grid for symmetry.
  const gridCols =
    cards.length === 4
      ? 'grid-cols-1 md:grid-cols-2 lg:max-w-4xl lg:mx-auto'
      : cards.length === 2
        ? 'grid-cols-1 md:grid-cols-2 lg:max-w-3xl lg:mx-auto'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto';

  return (
    <div className={cn('grid gap-5 md:gap-6', gridCols)}>
      {cards.map((item, i) => (
        <PricingCard key={item.id} item={item} idx={i} />
      ))}
    </div>
  );
}

/* ------------------------ Compact mini-card ----------------------------- */
function CompactCard({ item, idx }: { item: PricingItem; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SOFT_SPRING, delay: idx * 0.03 }}
      whileHover={{ y: -3 }}
      className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[260px] rounded-2xl bg-cream/95 backdrop-blur-sm border border-cream/15 px-4 py-3.5 shadow-[0_1px_2px_rgba(1,1,1,0.04),0_10px_30px_rgba(1,1,1,0.08)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sage text-sm leading-tight">
            {item.name}
          </div>
          {item.highlight && (
            <div className="text-[11px] text-sage/55 mt-1 leading-snug">
              {item.highlight}
            </div>
          )}
        </div>
        <div className="font-display text-base text-sage whitespace-nowrap flex-shrink-0">
          {item.price}
        </div>
      </div>
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
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
                Nos grilles{' '}
                <span className="italic text-cream/70">tarifaires</span>
              </h2>
            </div>

            {/* Editorial side-note — comic-style speech bubble pointing at the title */}
            <motion.aside
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SOFT_SPRING, delay: 0.15 }}
              className="relative max-w-sm self-start md:self-end"
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [-0.4, 0.6, -0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-[28px] bg-cream text-sage px-6 py-5 shadow-[0_18px_60px_rgba(1,1,1,0.25)] motion-reduce:!animate-none"
              >
                {/* Tail pointing toward the title (top-left) */}
                <span
                  aria-hidden
                  className="absolute -top-2 left-8 h-5 w-5 rotate-45 bg-cream rounded-[4px]"
                />
                {/* Tiny secondary "thought" dot, comic-style */}
                <motion.span
                  aria-hidden
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 left-4 h-2 w-2 rounded-full bg-cream/80 motion-reduce:!hidden"
                />

                <div className="flex items-center gap-2.5 mb-3 relative">
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
                <p className="text-[15px] leading-relaxed text-sage/85 relative">
                  Des prestations <strong className="text-sage">indépendantes</strong>,
                  pour quand vous savez déjà ce que vous voulez dire et à qui. Chaque
                  ligne se commande seule, sans engagement régulier ni stratégie
                  incluse.
                </p>
              </motion.div>
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
          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {cards.length > 0 && <CardsLayout cards={cards} />}

                {compact.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-14"
                  >
                    <div className="text-center mb-6">
                      <h3 className="font-display text-2xl text-cream">
                        Options à la carte
                      </h3>
                      <p className="mt-1 text-sm text-cream/65">
                        À combiner pour personnaliser votre projet · Tarifs HT
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-6xl mx-auto">
                      {compact.map((item, i) => (
                        <CompactCard key={item.id} item={item} idx={i} />
                      ))}
                    </div>
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
            donne toujours lieu à un devis sur-mesure, ajusté à votre propos, votre
            objectif et votre budget. On n'aime pas vendre des packages figés, ni
            cocher des cases sans intention derrière.
          </p>
        </div>
      </div>
    </section>
  );
}

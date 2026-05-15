'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Mail } from 'lucide-react';
import { SOFT_SPRING } from './Reveal';
import { AnimatedCounter, Magnetic } from './MotionPrimitives';

const stats: Array<{ value: number; suffix: string; label: string }> = [
  { value: 5, suffix: ' min', label: 'pour comprendre votre besoin' },
  { value: 48, suffix: 'h', label: 'pour vous revenir avec une proposition' },
  { value: 0, suffix: '', label: 'engagement avant signature' },
];

export default function Contact({ onOpenIntake }: { onOpenIntake: () => void }) {
  return (
    <section id="contact" className="section-pad relative text-cream overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* Animated halos — slow opposing drift, cream/accent on sage */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[120px] motion-reduce:!animate-none"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-cream/10 blur-[120px] motion-reduce:!animate-none"
      />

      <div className="container-narrow relative">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SOFT_SPRING}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
          >
            Parlons de votre{' '}
            <span className="italic text-accent relative inline-block">
              projet.
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: '0% 50%' }}
                className="absolute -bottom-2 left-0 right-3 h-[3px] bg-accent/70 rounded-full motion-reduce:!hidden"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SOFT_SPRING, delay: 0.15 }}
            className="mt-7 max-w-xl mx-auto text-cream/80 text-lg leading-relaxed"
          >
            Quinze questions, cinq minutes. À la carte, en abonnement, ou complètement
            sur-mesure — on construit ensemble la formule qui colle vraiment à votre
            propos, à votre objectif et à votre budget. On écoute avant de proposer,
            jamais l'inverse.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SOFT_SPRING, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Magnetic strength={0.22}>
              <button
                onClick={onOpenIntake}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full bg-accent text-cream px-8 py-4 font-medium hover:bg-accent-600 transition-colors shadow-lg shadow-accent/30"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Calendar size={18} />
                  Démarrer le brief
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent translate-x-[-150%] group-hover:translate-x-[450%] transition-transform duration-[1100ms] ease-out motion-reduce:!hidden"
                />
              </button>
            </Magnetic>
            <motion.a
              whileHover={{ y: -2 }}
              transition={SOFT_SPRING}
              href="mailto:contact@labandecreative.fr"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 px-8 py-4 font-medium hover:bg-cream hover:text-sage transition-colors"
            >
              <Mail size={18} />
              contact@labandecreative.fr
            </motion.a>
          </motion.div>
        </div>

        {/* Reassurance row — animated counters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 grid gap-6 md:grid-cols-3 text-cream/85"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...SOFT_SPRING, delay: 0.55 + i * 0.1 }}
              className="text-center border-l border-cream/15 first:border-l-0 md:px-6"
            >
              <div className="font-display text-5xl text-accent">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  duration={s.value === 0 ? 0.4 : 1.8}
                />
              </div>
              <div className="mt-2 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

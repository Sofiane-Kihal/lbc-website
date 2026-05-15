'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DriftingBlobs, FloatingParticles } from './BackgroundFx';
import { SOFT_SPRING } from './Reveal';
import { Magnetic, TiltCard, WordReveal } from './MotionPrimitives';

const TAGLINE_PHRASES = [
  'qui performe.',
  'qui raconte.',
  'qui touche.',
  'qui pense.',
];

/**
 * Typewriter that cycles through a list of phrases with a hard-blinking
 * cursor (terminal-style). Respects prefers-reduced-motion by rendering
 * just the first phrase statically.
 */
function Typewriter({
  phrases,
  startDelayMs = 0,
  typeMs = 65,
  deleteMs = 35,
  holdMs = 2400,
  gapMs = 350,
}: {
  phrases: string[];
  startDelayMs?: number;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  gapMs?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'wait' | 'typing' | 'holding' | 'deleting'>(
    'wait'
  );

  // Kick off after the initial delay.
  useEffect(() => {
    if (prefersReduced) return;
    const t = setTimeout(() => setPhase('typing'), startDelayMs);
    return () => clearTimeout(t);
  }, [startDelayMs, prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const phrase = phrases[idx];
    if (!phrase) return;

    if (phase === 'typing') {
      if (text.length < phrase.length) {
        const t = setTimeout(
          () => setText(phrase.slice(0, text.length + 1)),
          typeMs
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('holding'), 0);
      return () => clearTimeout(t);
    }
    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), holdMs);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(
          () => setText(phrase.slice(0, text.length - 1)),
          deleteMs
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }, gapMs);
      return () => clearTimeout(t);
    }
  }, [text, phase, idx, phrases, typeMs, deleteMs, holdMs, gapMs, prefersReduced]);

  if (prefersReduced) {
    return <span className="italic">{phrases[0]}</span>;
  }

  return (
    <span className="italic">
      {text}
      <span
        aria-hidden
        className="cursor-blink inline-block align-baseline w-[2px] md:w-[3px] h-[0.78em] bg-accent ml-[0.06em] translate-y-[0.08em] rounded-[1px]"
      />
    </span>
  );
}

export default function Hero({ onOpenIntake }: { onOpenIntake: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax layers — moved subtly while the hero is on screen.
  const yCardA = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yCardB = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yStat = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-[140px] pb-24 lg:pt-[180px] lg:pb-32 overflow-hidden grain"
    >
      {/* Animated background layers */}
      <DriftingBlobs variant="indigo" />
      <FloatingParticles />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 text-cream"
            >
              <motion.span
                animate={{ rotate: [0, 18, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex text-accent motion-reduce:!animate-none"
              >
                <Sparkles size={14} />
              </motion.span>
              <span className="text-[12px] font-medium uppercase tracking-[0.3em] opacity-60">
                Agence indépendante — Mantes-la-Jolie
              </span>
            </motion.div>

            <h1 className="font-display mt-6 text-[44px] md:text-[64px] lg:text-[84px] leading-[0.95] tracking-tight text-cream">
              <WordReveal text="L'agence de communication" delay={0.05} />
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SOFT_SPRING, delay: 0.4 }}
                className="font-normal text-accent inline-block"
              >
                <Typewriter phrases={TAGLINE_PHRASES} startDelayMs={650} />
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SOFT_SPRING, delay: 0.55 }}
              className="mt-7 max-w-xl text-lg md:text-xl text-cream/80 leading-relaxed"
            >
              On allie <strong className="text-cream">création artistique</strong> et{' '}
              <strong className="text-cream">performance</strong>. Un fond qui pense,
              une forme qui touche — et derrière, une stratégie qui transforme. Pas de
              jolies vidéos qui dorment dans un drive, pas de chiffres sans propos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SOFT_SPRING, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Magnetic strength={0.22}>
                <button onClick={onOpenIntake} className="btn-accent group relative overflow-hidden">
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Parlez-nous de votre projet
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </button>
              </Magnetic>
              <a
                href="#projets"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 bg-transparent px-7 py-3.5 font-medium text-cream transition-all duration-300 hover:border-cream hover:bg-cream hover:text-sage hover:-translate-y-0.5"
              >
                Voir nos projets
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.95 }}
              className="mt-12 flex items-center gap-6 text-cream/70 text-sm"
            >
              <div className="flex -space-x-2">
                {['#5d6ef4', '#FF6B35', '#010101'].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ ...SOFT_SPRING, delay: 1 + i * 0.08 }}
                    whileHover={{ y: -4, scale: 1.08 }}
                    className="h-9 w-9 rounded-full border-2 border-cream"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>+ d'une vingtaine de marques accompagnées en 2025</span>
            </motion.div>
          </div>

          {/* Right — visual collage */}
          <motion.div
            style={{ opacity: opacityFade }}
            className="lg:col-span-5 relative h-[480px] hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yCardA }}
              className="absolute top-0 right-0 h-[300px] w-[260px]"
            >
              <TiltCard
                max={6}
                glare
                className="h-full w-full rounded-3xl overflow-hidden shadow-2xl shadow-sage/20"
                style={{
                  background:
                    'linear-gradient(135deg, #5d6ef4 0%, #010101 100%)',
                }}
              >
                <div className="h-full w-full flex flex-col justify-end p-6 text-cream">
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-5 bg-accent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                      Production
                    </span>
                  </div>
                  <div className="font-display text-3xl mt-3 leading-tight">
                    Film <span className="italic">signature</span>
                  </div>
                  <div className="text-sm mt-1.5 text-cream/70">
                    PME · Luxe · 4K
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 9 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yCardB }}
              className="absolute top-[180px] left-0 h-[260px] w-[240px]"
            >
              <TiltCard
                max={6}
                glare
                className="h-full w-full rounded-3xl overflow-hidden shadow-2xl shadow-stone/40"
                style={{
                  background:
                    'linear-gradient(135deg, #FAF1E6 0%, #C7C0AE 100%)',
                }}
              >
                <div className="h-full w-full flex flex-col justify-end p-6 text-sage">
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-5 bg-accent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                      Stratégie
                    </span>
                  </div>
                  <div className="font-display text-3xl mt-3 leading-tight">
                    Plan <span className="italic">360°</span>
                  </div>
                  <div className="text-sm mt-1.5 text-sage/65">
                    Audit · Persona · Indicateurs
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...SOFT_SPRING, delay: 0.7 }}
              style={{ y: yStat }}
              className="absolute bottom-4 right-8 h-[140px] w-[180px]"
            >
              <TiltCard
                max={10}
                className="h-full w-full rounded-3xl bg-cream border border-sage/15 shadow-xl shadow-sage/10 p-5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-accent" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                    Engagement
                  </span>
                </div>
                <div className="font-display text-5xl text-accent leading-none">
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SOFT_SPRING, delay: 1.1 }}
                    className="inline-block"
                  >
                    +248%
                  </motion.span>
                </div>
                <div className="text-xs text-sage/60 italic">
                  vs trimestre précédent
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — bottom of hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-cream/50 text-[10px] font-medium uppercase tracking-[0.3em]"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-cream/50 motion-reduce:!animate-none"
        />
      </motion.div>
    </section>
  );
}

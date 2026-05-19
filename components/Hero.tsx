'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import type { HeroStrip, Project } from '@/lib/defaults';
import { BRAND, coverStyle } from '@/lib/colors';
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

export default function Hero({
  onOpenIntake,
  featuredProject,
  strip,
}: {
  onOpenIntake: () => void;
  featuredProject?: Project | null;
  strip?: HeroStrip | null;
}) {
  const stripLogos = strip?.logos ?? [];
  const stripCaption = strip?.caption?.trim() ?? '';
  const showStrip = stripLogos.length > 0 || stripCaption.length > 0;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax — single subtle lift on the featured card as the hero scrolls.
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -120]);
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
                Agence indépendante · Mantes-la-Jolie · Yvelines
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
              une forme qui touche, et derrière, une stratégie qui transforme. Pas de
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

            {showStrip && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.95 }}
                className="mt-12 flex items-center gap-6 text-cream/70 text-sm"
              >
                {stripLogos.length > 0 ? (
                  <div className="flex -space-x-2">
                    {stripLogos.map((l, i) => (
                      <motion.div
                        key={l.id}
                        initial={{ opacity: 0, scale: 0.4, x: -8 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ ...SOFT_SPRING, delay: 1 + i * 0.08 }}
                        whileHover={{ y: -4, scale: 1.08 }}
                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-cream bg-cream overflow-hidden"
                        title={l.name}
                      >
                        {l.image ? (
                          <img
                            src={l.image}
                            alt={l.name}
                            className="h-full w-full object-contain p-1"
                            style={
                              (l.monochrome ?? true)
                                ? { filter: 'brightness(0)', opacity: 0.85 }
                                : undefined
                            }
                          />
                        ) : (
                          <span className="font-display text-sage text-xs">
                            {l.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex -space-x-2">
                    {[BRAND.sage, BRAND.accent, BRAND.moss].map((c, i) => (
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
                )}
                {stripCaption && <span>{stripCaption}</span>}
              </motion.div>
            )}
          </div>

          {/* Right — featured project card */}
          {featuredProject && (
            <motion.div
              style={{ opacity: opacityFade }}
              className="lg:col-span-5 relative h-[520px] hidden lg:flex items-center justify-center"
            >
              <FeaturedProjectCard project={featuredProject} y={cardY} />
            </motion.div>
          )}
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

/* -------------------- Featured project card ----------------------------- */
function FeaturedProjectCard({
  project,
  y,
}: {
  project: Project;
  y: MotionValue<number>;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ y }}
      className="relative w-[360px] aspect-[4/5] max-h-[500px]"
    >
      {/* Continuous floating layer — gentle bob + sway */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : { y: [0, -10, 0], rotate: [-1, 1.2, -1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="h-full w-full motion-reduce:!animate-none"
      >
        {/* Editorial accent eyebrow floating top-left, slightly outside */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SOFT_SPRING, delay: 0.8 }}
          className="absolute -top-3 -left-3 z-20 inline-flex items-center gap-2 rounded-full bg-cream text-sage px-3 py-1.5 shadow-lg shadow-moss/30"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <motion.span
              aria-hidden
              animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-accent motion-reduce:!animate-none"
            />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
            À découvrir
          </span>
        </motion.div>

        <Link
          href={`/projets/${project.slug}`}
          className="group block h-full w-full relative rounded-[28px] overflow-hidden shadow-2xl shadow-moss/30"
          aria-label={project.coverAlt || `Voir le projet ${project.title}`}
        >
          <TiltCard
            max={6}
            glare
            className="h-full w-full"
            style={coverStyle(project.cover)}
          >
            {/* Soft cover zoom on hover */}
            <motion.div
              aria-hidden
              initial={false}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 motion-reduce:!transform-none"
              style={coverStyle(project.cover)}
            />

            {/* Dark gradient anchor for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/30 to-moss/10 group-hover:from-moss/95 transition-opacity duration-700" />

            {/* Year pill */}
            <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-cream/85 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage z-10">
              {project.year}
            </div>

            {/* Arrow corner */}
            <motion.span
              aria-hidden
              whileHover={{ rotate: 45, scale: 1.1 }}
              transition={SOFT_SPRING}
              className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-cream text-sage z-10 shadow-md shadow-moss/40"
            >
              <ArrowUpRight size={16} />
            </motion.span>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-cream z-10">
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {project.categories.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cream/85 bg-cream/15 backdrop-blur-sm rounded-full px-2.5 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-3xl md:text-4xl leading-[1.05]">
                {project.title}
              </h3>
              <div className="mt-1.5 text-sm text-cream/75">{project.client}</div>

              <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.28em] text-accent">
                Découvrir
                <motion.span
                  aria-hidden
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={SOFT_SPRING}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </div>
            </div>
          </TiltCard>
        </Link>
      </motion.div>
    </motion.div>
  );
}

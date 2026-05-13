'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DriftingBlobs, FloatingParticles } from './BackgroundFx';
import { SOFT_SPRING } from './Reveal';
import { Magnetic, TiltCard, WordReveal } from './MotionPrimitives';

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
      <DriftingBlobs variant="cream" />
      <FloatingParticles />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 text-sage"
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

            <h1 className="font-display mt-6 text-[44px] md:text-[64px] lg:text-[84px] leading-[0.95] tracking-tight text-sage">
              <WordReveal text="L'agence de communication" delay={0.05} />{' '}
              <span className="inline-block overflow-hidden align-baseline pb-[0.15em]">
                <motion.span
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...SOFT_SPRING, delay: 0.25 }}
                  className="inline-block gradient-text"
                >
                  360°
                </motion.span>
              </span>
              <br />
              <span className="inline-block overflow-hidden align-baseline pb-[0.15em]">
                <motion.span
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...SOFT_SPRING, delay: 0.4 }}
                  className="italic font-normal text-accent inline-block relative"
                >
                  qui performe.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.95, ease: [0.65, 0, 0.35, 1] }}
                    style={{ transformOrigin: '0% 50%' }}
                    className="absolute -bottom-1 left-0 right-2 h-[3px] bg-accent/70 rounded-full motion-reduce:!hidden"
                  />
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SOFT_SPRING, delay: 0.55 }}
              className="mt-7 max-w-xl text-lg md:text-xl text-sage/75 leading-relaxed"
            >
              On allie <strong className="text-sage">création artistique</strong> et{' '}
              <strong className="text-sage">performance</strong>. Pas de jolie vidéo qui
              dort dans un drive — une stratégie qui transforme votre audience en clients,
              et une exécution qui fait du bien aux yeux.
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
                  {/* Shine sweep */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent translate-x-[-150%] group-hover:translate-x-[450%] transition-transform duration-[1100ms] ease-out motion-reduce:!hidden"
                  />
                </button>
              </Magnetic>
              <a href="#projets" className="btn-secondary group">
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
              className="mt-12 flex items-center gap-6 text-sage/60 text-sm"
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-sage/40 text-[10px] font-medium uppercase tracking-[0.3em]"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-sage/40 motion-reduce:!animate-none"
        />
      </motion.div>
    </section>
  );
}

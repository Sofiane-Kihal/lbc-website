'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/defaults';
import { coverStyle } from '@/lib/colors';
import { DriftingBlobs, DotsPattern } from './BackgroundFx';
import Reveal, { SOFT_SPRING } from './Reveal';
import { TiltCard } from './MotionPrimitives';

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section id="projets" className="section-pad relative overflow-hidden bg-cream text-sage">
      <DriftingBlobs variant="cream" />
      <DotsPattern variant="sage" className="opacity-[0.08]" />
      <div className="container-wide relative">
        <Reveal>
          <div className="mb-14">
            <h2 className="font-display text-4xl md:text-6xl text-sage leading-[1.05]">
              Nos projets <span className="italic text-moss-dark">récents</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SOFT_SPRING, delay: i * 0.07 }}
            >
              <TiltCard max={5} className="rounded-3xl">
                <Link
                  href={`/projets/${p.slug}`}
                  className="group block relative aspect-[4/5] rounded-3xl overflow-hidden"
                  style={coverStyle(p.cover)}
                  aria-label={p.coverAlt || `${p.title} · ${p.categories.join(', ')}`}
                >
                  {/* Image zoom on hover (via inner div) */}
                  <motion.div
                    aria-hidden
                    initial={false}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 motion-reduce:!transform-none"
                    style={coverStyle(p.cover)}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sage/85 via-sage/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

                  {/* Floating tag */}
                  <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-cream/85 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-sage z-10">
                    {p.year}
                  </div>

                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.08 }}
                    transition={SOFT_SPRING}
                    className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-cream/85 backdrop-blur-sm text-sage z-10"
                  >
                    <ArrowUpRight size={16} />
                  </motion.div>

                  {/* Title — slides up softly on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-cream translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-out z-10">
                    <div className="text-xs uppercase tracking-widest opacity-80 mb-2">
                      {p.categories.join(' · ')}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl leading-tight">
                      {p.title}
                    </h3>
                    <div className="mt-2 max-h-0 group-hover:max-h-32 overflow-hidden transition-[max-height] duration-700 ease-out">
                      <p className="text-sm text-cream/85 mt-2 line-clamp-3">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

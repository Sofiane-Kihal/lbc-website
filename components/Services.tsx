'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { DriftingBlobs } from './BackgroundFx';
import Reveal, { SOFT_SPRING } from './Reveal';
import InfoModal from './InfoModal';
import { cn } from '@/lib/utils';

type Service = {
  number: string;
  title: string;
  bullets: string[];
  reveal?: { question: string; answer: string };
};

const services: Service[] = [
  {
    number: '01',
    title: 'Audit',
    bullets: [
      'État des lieux de l\'existant',
      'Analyse concurrentielle',
      'Veille sectorielle',
      'Analyse cible',
    ],
    reveal: {
      question: 'Un audit, à quoi ça sert ?',
      answer:
        "Un audit marketing social media sert à analyser en profondeur la présence d'une marque sur les réseaux sociaux afin d'évaluer ce qui fonctionne et ce qui doit être amélioré. Il permet d'examiner les performances des contenus (engagement, portée, croissance), la cohérence de la stratégie, le positionnement face aux concurrents et l'adéquation avec la cible visée. L'objectif est d'identifier des opportunités d'optimisation, corriger les points faibles et ajuster la stratégie pour gagner en visibilité, en efficacité et en retour sur investissement.",
    },
  },
  {
    number: '02',
    title: 'Stratégie',
    bullets: [
      'Ciblage & persona',
      "Plan d'action 3 à 6 mois",
      'Ligne éditoriale',
      'Budget & calendrier',
      'Tableau social media',
      'SEO',
    ],
    reveal: {
      question: 'Une stratégie, à quoi ça sert ?',
      answer:
        "Une stratégie social media consiste à planifier et organiser l'ensemble des actions menées sur les réseaux sociaux afin d'atteindre des objectifs précis (visibilité, engagement, conversion). Elle définit les cibles, les messages, les plateformes à privilégier, le type de contenus à produire et le calendrier de publication, tout en s'appuyant sur l'analyse des performances pour optimiser en continu les résultats.\n\nUne stratégie de communication digitale 360° est une approche globale qui vise à coordonner tous les canaux numériques (réseaux sociaux, site web, email, publicité en ligne, référencement, etc.) pour offrir une expérience cohérente et impactante à l'utilisateur. Elle permet de diffuser un message uniforme sur l'ensemble des points de contact, d'optimiser la visibilité de la marque et de maximiser les performances en combinant différents leviers digitaux de manière complémentaire.",
    },
  },
  {
    number: '03',
    title: 'Création & Production',
    bullets: [
      'Identité graphique',
      'Templates : flyers, carrousels, miniatures',
      'Brief, casting & script',
      'Tournage & photos',
      'Montage & multi-formats',
    ],
  },
  {
    number: '04',
    title: 'Community Management',
    bullets: [
      'Stories',
      'Publication : musique, couverture, texte SEO, personal branding',
      'Modération commentaires',
      'Réponse DM',
    ],
  },
  {
    number: '05',
    title: '360°',
    bullets: [
      'Site',
      'SEO',
      'Indicateurs de performance',
      'Mailing',
      'Campagne SMS',
      "Rédaction d'articles",
    ],
  },
];

function ServiceCard({
  s,
  idx,
  spanClass,
}: {
  s: Service;
  idx: number;
  spanClass?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...SOFT_SPRING, delay: idx * 0.05 }}
      whileHover={{ y: -6 }}
      className={cn(
        'card-soft p-7 md:p-8 group hover:shadow-[0_4px_8px_rgba(93,110,244,0.08),0_24px_60px_rgba(93,110,244,0.18)] transition-shadow duration-500 relative overflow-hidden',
        spanClass
      )}
    >
      {/* Hover sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-sage/10 to-transparent translate-x-[-200%] group-hover:translate-x-[700%] transition-transform duration-[1400ms] ease-out motion-reduce:!hidden"
      />

      <div className="flex items-baseline gap-4 relative">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SOFT_SPRING, delay: idx * 0.05 + 0.05 }}
          className="font-display italic text-5xl md:text-6xl leading-none text-accent"
        >
          {s.number}
        </motion.span>
        <span className="h-px flex-1 bg-sage/15 group-hover:bg-sage/30 transition-colors duration-500" />
      </div>

      <h3 className="font-display mt-5 text-3xl text-sage relative">{s.title}</h3>

      <ul className="mt-5 space-y-2 relative">
        {s.bullets.map((b, i) => (
          <motion.li
            key={b}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...SOFT_SPRING, delay: idx * 0.05 + 0.15 + i * 0.04 }}
            className="flex items-start gap-2 text-sage/75 text-[15px] leading-relaxed"
          >
            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-moss flex-shrink-0 group-hover:bg-accent transition-colors duration-500" />
            {b}
          </motion.li>
        ))}
      </ul>

      {s.reveal && (
        <>
          <div className="mt-6 pt-6 border-t border-sage/10 relative">
            <button
              onClick={() => setOpen(true)}
              className="group/btn flex w-full items-center justify-between gap-3 text-left hover:text-sage-700 transition-colors"
            >
              <span className="font-medium text-sage italic group-hover/btn:text-sage-700">
                {s.reveal.question}
              </span>
              <motion.span
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={SOFT_SPRING}
                className="grid h-7 w-7 place-items-center rounded-full bg-sage/10 text-sage group-hover/btn:bg-sage group-hover/btn:text-cream transition-colors"
              >
                <HelpCircle size={14} />
              </motion.span>
            </button>
          </div>
          <InfoModal
            open={open}
            onClose={() => setOpen(false)}
            title={s.reveal.question}
          >
            {s.reveal.answer}
          </InfoModal>
        </>
      )}
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" className="section-pad relative bg-cream overflow-hidden">
      <DriftingBlobs variant="cream" />
      <div className="container-wide relative">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <div className="eyebrow text-sage">
              <span className="eyebrow-num">03</span>
              <span className="eyebrow-rule" />
              <span className="eyebrow-label">Méthode</span>
            </div>
            <h2 className="font-display mt-4 text-4xl md:text-6xl text-sage leading-[1.05]">
              Ce que nous faisons{' '}
              <span className="italic text-moss-dark">pour vous</span>
            </h2>
            <p className="mt-5 text-sage/70 text-lg">
              Cinq métiers, un seul fil rouge : votre objectif business. On ne saute
              jamais une étape — surtout pas la stratégie.
            </p>
          </div>
        </Reveal>

        {/*
          5 cards on a 6-col grid: row 1 = 3 × span-2, row 2 = 2 × span-3.
          Top row = "fundations" (Audit, Stratégie, Création/Production),
          bottom row = "activation" (Community Management, 360°). Visually
          balanced and editorially logical.
        */}
        <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <ServiceCard
              key={s.number}
              s={s}
              idx={i}
              spanClass={i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="#tarifs"
            className="inline-flex items-center gap-2 text-sage italic font-medium hover:text-sage-700 transition-colors"
          >
            <span>Voir nos grilles tarifaires</span>
            <span className="h-px w-10 bg-sage" />
          </a>
        </div>
      </div>
    </section>
  );
}

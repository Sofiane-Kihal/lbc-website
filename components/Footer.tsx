'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { BUSINESS } from '@/lib/seo';
import { SOFT_SPRING } from './Reveal';

const navLinks = [
  { href: '#projets', label: 'Projets' },
  { href: '#services', label: 'Services' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#abonnements', label: 'Abonnements' },
  { href: '#contact', label: 'Contact' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:contact@labandecreative.fr' },
];

export default function Footer() {
  return (
    <footer className="relative bg-moss text-cream overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="container-wide relative pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={SOFT_SPRING}
          >
            <Link href="/" className="flex items-center group">
              <span className="font-display text-xl">La Bande Créative</span>
            </Link>
            <p className="mt-5 max-w-sm text-cream/80 text-sm leading-relaxed">
              Agence de communication 360° à <strong className="text-cream">Mantes-la-Jolie</strong>.
              {' '}Production vidéo, photo et stratégie pour les marques des Yvelines (78)
              et d'Île-de-France.
            </p>
            <address className="mt-4 text-cream/60 text-xs not-italic" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="streetAddress">{BUSINESS.street}</span>
              <br />
              <span itemProp="postalCode">{BUSINESS.postalCode}</span>{' '}
              <span itemProp="addressLocality">{BUSINESS.city}</span>{' '}·{' '}
              <span itemProp="addressRegion">Yvelines</span>,{' '}
              <span itemProp="addressCountry">France</span>
            </address>
            <p className="mt-3 text-cream/70 text-xs">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="hover:text-cream transition-colors"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...SOFT_SPRING, delay: 0.08 }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-cream/60">
              Navigation
            </h4>
            <ul className="mt-5 space-y-2.5 text-cream/90 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative inline-block hover:text-cream after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...SOFT_SPRING, delay: 0.16 }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-cream/60">
              Suivez-nous
            </h4>
            <div className="mt-5 flex gap-3">
              {socials.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SOFT_SPRING, delay: 0.2 + i * 0.05 }}
                  whileHover={{ y: -3, rotate: -4 }}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:bg-cream hover:text-sage hover:border-cream transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
            <p className="mt-6 text-cream/60 text-xs">
              contact@labandecreative.fr
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-6 border-t border-cream/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-cream/60"
        >
          <p>© {new Date().getFullYear()} La Bande Créative · Tous droits réservés</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cream transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-cream transition-colors">Confidentialité</a>
            <Link href="/admin" className="hover:text-cream transition-colors">Admin</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOFT_SPRING } from './Reveal';

const links = [
  { href: '#projets', label: 'Projets' },
  { href: '#services', label: 'Services' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#abonnements', label: 'Abonnements' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation({ onOpenIntake }: { onOpenIntake: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...SOFT_SPRING, delay: 0.05 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 text-cream',
        scrolled
          ? 'bg-sage/85 backdrop-blur-md border-b border-cream/10 shadow-[0_4px_20px_-12px_rgba(1,1,1,0.35)]'
          : 'bg-transparent'
      )}
    >
      <div className="container-wide flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.span
            whileHover={{ rotate: 14, scale: 1.06 }}
            transition={SOFT_SPRING}
            className="grid place-items-center h-9 w-9 rounded-full bg-cream text-sage font-display text-lg"
          >
            L
          </motion.span>
          <span className="font-display text-lg leading-none text-cream">
            La Bande<span className="text-accent"> Créative</span>
          </span>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-2"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onMouseEnter={() => setHovered(l.href)}
              className="relative px-3 py-2 text-sm font-medium text-cream/80 hover:text-cream transition-colors"
            >
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  transition={{ ...SOFT_SPRING, stiffness: 280, damping: 24 }}
                  className="absolute inset-0 rounded-full bg-cream/15"
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.97 }}
            transition={SOFT_SPRING}
            onClick={onOpenIntake}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-sage hover:bg-cream/90 px-5 py-2.5 text-sm font-medium relative overflow-hidden group transition-colors"
          >
            <span className="relative z-10">Parlez-nous de votre projet</span>
          </motion.button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-cream/30 text-cream relative overflow-hidden"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={open ? 'close' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden"
          >
            <nav className="container-wide pb-6 pt-2 flex flex-col gap-2 bg-sage/95 backdrop-blur-md">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SOFT_SPRING, delay: 0.05 + i * 0.04 }}
                  className="py-3 border-b border-cream/15 text-cream font-medium"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SOFT_SPRING, delay: 0.05 + links.length * 0.04 }}
                onClick={() => {
                  setOpen(false);
                  onOpenIntake();
                }}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-cream text-sage hover:bg-cream/90 px-7 py-3.5 font-medium transition-colors"
              >
                Parlez-nous de votre projet
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

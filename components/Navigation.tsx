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
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-cream/85 backdrop-blur-md border-b border-sage/10 shadow-[0_4px_20px_-12px_rgba(93,110,244,0.18)]'
          : 'bg-transparent'
      )}
    >
      <div className="container-wide flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.span
            whileHover={{ rotate: 14, scale: 1.06 }}
            transition={SOFT_SPRING}
            className="grid place-items-center h-9 w-9 rounded-full bg-sage text-cream font-display text-lg"
          >
            L
          </motion.span>
          <span className="font-display text-lg leading-none">
            La Bande<span className="text-moss"> Créative</span>
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
              className="relative px-3 py-2 text-sm font-medium text-sage/80 hover:text-sage transition-colors"
            >
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  transition={{ ...SOFT_SPRING, stiffness: 280, damping: 24 }}
                  className="absolute inset-0 rounded-full bg-sage/10"
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
            className="btn-primary text-sm py-2.5 px-5 relative overflow-hidden group"
          >
            <span className="relative z-10">Parlez-nous de votre projet</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-150%] group-hover:translate-x-[450%] transition-transform duration-[1100ms] ease-out motion-reduce:!hidden"
            />
          </motion.button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-sage/20 text-sage relative overflow-hidden"
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
            <nav className="container-wide pb-6 pt-2 flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SOFT_SPRING, delay: 0.05 + i * 0.04 }}
                  className="py-3 border-b border-sage/10 text-sage font-medium"
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
                className="btn-primary mt-4 w-full"
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

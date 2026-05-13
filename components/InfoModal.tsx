'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Lightweight info popup. Centered, smooth scale-in, click outside to close.
 * Used for "à quoi ça sert" reveals on Service cards so the cards don't
 * deform when the user wants more context.
 */
export default function InfoModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  // Wait for client mount before using createPortal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock scroll + Esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  // Render through a portal on document.body so the modal escapes any
  // ancestor `transform` / `filter` stacking contexts (otherwise framer-
  // motion transforms on cards would trap our `position: fixed`).
  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-sage/40 backdrop-blur-sm"
          />

          {/* Card — stop click propagation so internal clicks don't close */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.7 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-cream rounded-3xl shadow-2xl shadow-sage/30 p-7 md:p-9 max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full hover:bg-sage/10 text-sage transition-colors"
            >
              <X size={16} />
            </button>

            {title && (
              <h3 className="font-display text-2xl md:text-3xl text-sage leading-tight pr-10 mb-5">
                {title}
              </h3>
            )}

            <div className="text-[15px] text-sage/80 leading-relaxed whitespace-pre-line">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

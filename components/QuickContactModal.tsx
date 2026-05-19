'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type PresetAddon = { id: string; name: string; price: string; cadence: string };

/**
 * Lightweight contact form for "I already chose this offer, contact me".
 * Used by the Subscriptions section so users who already know what they
 * want skip the 15-question brief.
 */
export default function QuickContactModal({
  open,
  onClose,
  preset,
}: {
  open: boolean;
  onClose: () => void;
  preset: {
    kind: 'subscription';
    id: string;
    name: string;
    price?: string;
    compact?: boolean;
    addon?: PresetAddon;
  } | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The chosen formula may carry its own optional add-on (e.g. CM at a
  // formula-specific price). Compact presets don't carry add-ons themselves.
  const availableAddons: PresetAddon[] =
    preset && !preset.compact && preset.addon ? [preset.addon] : [];

  // Reset on (re)open
  useEffect(() => {
    if (open) {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
      setSelectedAddons([]);
      setSubmitting(false);
      setDone(false);
      setError(null);
    }
  }, [open]);

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

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    /\S+@\S+\.\S+/.test(form.email);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const chosenAddons = availableAddons
        .filter((a) => selectedAddons.includes(a.id))
        .map((a) => ({
          id: a.id,
          name: a.name,
          price: `${a.price} HT ${a.cadence}`,
        }));
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'quick-contact',
          preset: { ...preset, addons: chosenAddons },
          answers: { contact: form },
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setDone(true);
    } catch (e: any) {
      setError(e?.message || 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
          aria-modal="true"
          role="dialog"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-sage/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.7 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-cream rounded-t-3xl md:rounded-3xl shadow-2xl shadow-sage/30 overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header — editorial preset summary */}
            <div className="bg-sage text-cream p-6 md:p-7 relative">
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full hover:bg-cream/10 text-cream transition-colors"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-accent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                  Formule choisie
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight">
                {preset?.name}
              </h3>
              {preset?.price && (
                <p className="mt-1 text-cream/75 text-sm">{preset.price}</p>
              )}
              <AnimatePresence initial={false}>
                {selectedAddons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cream/15">
                      {availableAddons
                        .filter((a) => selectedAddons.includes(a.id))
                        .map((a) => (
                          <span
                            key={a.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-2.5 py-1 text-[11px] text-cream/85"
                          >
                            <span className="h-1 w-1 rounded-full bg-accent" />
                            {a.name}
                            <span className="text-cream/55">+{a.price}</span>
                          </span>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {done ? (
              <div className="p-8 md:p-10 text-center">
                <div className="inline-flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-accent" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                    C'est noté
                  </span>
                  <span className="h-px w-8 bg-accent" />
                </div>
                <h4 className="font-display text-2xl md:text-3xl text-sage leading-[1.15]">
                  On revient vers vous{' '}
                  <span className="italic text-accent">sous 48h</span>.
                </h4>
                <p className="mt-4 text-sage/70 text-sm leading-relaxed max-w-sm mx-auto">
                  Avec une proposition ajustée à votre formule.
                </p>
                <button onClick={onClose} className="btn-primary mt-7">
                  Fermer
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="p-6 md:p-7 flex-1 overflow-y-auto"
              >
                <p className="text-sage/70 text-sm mb-5">
                  Vos coordonnées. On revient vers vous sous 48h avec une proposition
                  ajustée.
                </p>

                {availableAddons.length > 0 && (
                  <div className="mb-6 rounded-2xl border border-sage/15 bg-sage/[0.03] p-4">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <h4 className="text-sm font-semibold text-sage">
                        Ajouter en supplément
                      </h4>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sage/50">
                        Facultatif
                      </span>
                    </div>
                    <ul className="grid gap-2">
                      {availableAddons.map((a) => {
                        const sel = selectedAddons.includes(a.id);
                        return (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAddons((prev) =>
                                  sel
                                    ? prev.filter((id) => id !== a.id)
                                    : [...prev, a.id]
                                )
                              }
                              className={cn(
                                'group w-full flex items-center gap-3 text-left rounded-xl border px-3.5 py-2.5 transition-all',
                                sel
                                  ? 'border-accent/50 bg-accent/[0.08]'
                                  : 'border-sage/15 bg-cream hover:border-sage/30'
                              )}
                            >
                              <span
                                className={cn(
                                  'grid h-5 w-5 place-items-center rounded-full border flex-shrink-0 transition-colors',
                                  sel
                                    ? 'bg-accent border-accent text-cream'
                                    : 'border-sage/30 text-sage/40 group-hover:border-sage/50'
                                )}
                              >
                                {sel ? (
                                  <Check size={12} strokeWidth={3} />
                                ) : (
                                  <Plus size={12} strokeWidth={2.5} />
                                )}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-medium text-sage text-sm">
                                  {a.name}
                                </span>
                                <span className="block text-[11px] text-sage/55 mt-0.5">
                                  On gère vos stories, vos commentaires, vos DM. De
                                  A à Z.
                                </span>
                              </span>
                              <span className="font-display text-sage text-base whitespace-nowrap flex-shrink-0">
                                +{a.price}
                                <span className="text-[10px] text-sage/50 ml-1">
                                  HT {a.cadence}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Prénom *">
                    <input
                      className="input-base"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Nom *">
                    <input
                      className="input-base"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Email *">
                    <input
                      type="email"
                      className="input-base"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Téléphone">
                    <input
                      className="input-base"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                  </Field>
                  <Field label="Entreprise" className="sm:col-span-2">
                    <input
                      className="input-base"
                      value={form.company}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company: e.target.value }))
                      }
                    />
                  </Field>
                  <Field label="Un mot pour la route ?" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      className="input-base resize-none"
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                    />
                  </Field>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className={cn(
                    'mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium text-sm transition-all',
                    canSubmit
                      ? 'bg-accent text-cream hover:bg-accent-600 hover:-translate-y-0.5 shadow-lg shadow-accent/30'
                      : 'bg-sage/15 text-sage/40 cursor-not-allowed'
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="block text-xs font-medium text-sage/70 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

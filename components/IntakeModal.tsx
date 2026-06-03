'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOFT_SPRING } from './Reveal';
import { intakeQuestions as questions } from '@/lib/intakeQuestions';


type Answers = Record<string, any>;

const DRAFT_KEY = 'lbc-intake-draft';

export default function IntakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = questions.length;
  const q = questions[step];
  const progress = useMemo(
    () => Math.round(((step + (done ? 1 : 0)) / total) * 100),
    [step, total, done]
  );

  // On open: try to resume from a saved draft so that a misclick on the
  // backdrop doesn't wipe the user's progress. Drafts are cleared on
  // successful submit (see handleSubmit).
  useEffect(() => {
    if (!open) return;
    setSubmitting(false);
    setDone(false);
    setError(null);
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const savedAnswers =
          parsed && typeof parsed.answers === 'object' && parsed.answers !== null
            ? parsed.answers
            : {};
        const savedStep =
          typeof parsed?.step === 'number'
            ? Math.min(Math.max(0, parsed.step), total - 1)
            : 0;
        setAnswers(savedAnswers);
        setStep(savedStep);
        return;
      }
    } catch {
      // Corrupted draft or storage unavailable — fall through to fresh start.
    }
    setStep(0);
    setAnswers({});
  }, [open, total]);

  // Persist progress on every change while the modal is open and not yet
  // submitted — so closing (intentional or by mistake) keeps the state.
  useEffect(() => {
    if (!open || done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers }));
    } catch {
      // Quota / private mode — silently ignore, modal still works in-memory.
    }
  }, [open, done, step, answers]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const setAnswer = (id: string, value: any) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  const canNext = useMemo(() => {
    if (!q) return false;
    if (q.type === 'contact') {
      const c = answers[q.id] || {};
      return c.firstName && c.lastName && c.email && /\S+@\S+\.\S+/.test(c.email);
    }
    if (q.type === 'multi') {
      const v = answers[q.id];
      return Array.isArray(v) && v.length > 0;
    }
    return Boolean(answers[q.id]);
  }, [q, answers]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setDone(true);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
    } catch (e: any) {
      setError(e?.message || 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (step < total - 1) setStep((s) => s + 1);
    else handleSubmit();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-sage/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-3xl bg-cream rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl shadow-sage/30 max-h-[92vh] flex flex-col"
          >
            {/* Top bar — editorial header */}
            <div className="px-6 md:px-10 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-sage/10">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display italic text-xl md:text-2xl text-sage leading-none">
                    Brief
                  </span>
                  <span className="h-px w-6 bg-sage/25" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                    {done ? 'Merci' : `${step + 1} / ${total}`}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-sage/55">
                  Quinze questions, cinq minutes, sans engagement.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-sage/10 text-sage transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress bar — accent rail */}
            <div className="h-[2px] w-full bg-sage/8 relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center gap-3 mb-6">
                    <span className="h-px w-10 bg-accent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                      C'est noté
                    </span>
                    <span className="h-px w-10 bg-accent" />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-sage leading-[1.1]">
                    On revient vers vous{' '}
                    <span className="italic text-accent">sous 48h</span>.
                  </h3>
                  <p className="mt-5 text-sage/70 max-w-md mx-auto leading-relaxed">
                    Première lecture de votre brief, puis on planifie un échange si on
                    sent une bonne piste.
                  </p>
                  <button onClick={onClose} className="btn-primary mt-8">
                    Fermer
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="font-display text-2xl md:text-3xl text-sage leading-tight">
                      {q.title}
                    </h3>
                    {'hint' in q && q.hint && (
                      <p className="mt-2 text-sage/60 text-sm">{q.hint}</p>
                    )}

                    {q.type === 'single' && (
                      <div className="mt-7 grid gap-2">
                        {q.options.map((o) => {
                          const sel = answers[q.id] === o.value;
                          return (
                            <button
                              key={o.value}
                              onClick={() => setAnswer(q.id, o.value)}
                              className={cn(
                                'group relative flex items-start gap-4 text-left rounded-2xl border px-5 py-4 transition-all overflow-hidden',
                                sel
                                  ? 'border-sage/40 bg-sage/[0.04]'
                                  : 'border-sage/15 hover:border-sage/30 hover:bg-sage/[0.02]'
                              )}
                            >
                              <motion.span
                                aria-hidden
                                initial={false}
                                animate={{ scaleY: sel ? 1 : 0 }}
                                transition={SOFT_SPRING}
                                style={{ transformOrigin: 'center' }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-[3px] bg-accent rounded-r-full"
                              />
                              <span className="flex-1 pl-1">
                                <span className="block font-medium text-sage">
                                  {o.label}
                                </span>
                                {o.description && (
                                  <span className="block text-sm text-sage/60 mt-0.5">
                                    {o.description}
                                  </span>
                                )}
                              </span>
                              {sel && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={SOFT_SPRING}
                                  className="mt-0.5 text-accent flex-shrink-0"
                                >
                                  <Check size={16} strokeWidth={2.5} />
                                </motion.span>
                              )}
                            </button>
                          );
                        })}
                        <AnimatePresence initial={false}>
                          {(() => {
                            const selected = q.options.find(
                              (o) => o.value === answers[q.id]
                            );
                            if (!selected?.allowComment) return null;
                            const commentKey = `${q.id}_comment`;
                            return (
                              <motion.label
                                key="comment"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.25 }}
                                className="block overflow-hidden"
                              >
                                <span className="block text-xs font-medium text-sage/70 mb-1.5 mt-2">
                                  Précisez (facultatif)
                                </span>
                                <input
                                  type="text"
                                  autoFocus
                                  value={(answers[commentKey] as string) || ''}
                                  onChange={(e) => setAnswer(commentKey, e.target.value)}
                                  placeholder="Dites-nous en plus…"
                                  className="input-base"
                                />
                              </motion.label>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    )}

                    {q.type === 'multi' && (
                      <div className="mt-7 grid gap-2 sm:grid-cols-2">
                        {q.options.map((o) => {
                          const arr: string[] = answers[q.id] || [];
                          const sel = arr.includes(o.value);
                          return (
                            <button
                              key={o.value}
                              onClick={() => {
                                const next = sel
                                  ? arr.filter((v) => v !== o.value)
                                  : [...arr, o.value];
                                setAnswer(q.id, next);
                              }}
                              className={cn(
                                'group relative flex items-start gap-3 text-left rounded-2xl border px-4 py-3.5 transition-all overflow-hidden',
                                sel
                                  ? 'border-sage/40 bg-sage/[0.04]'
                                  : 'border-sage/15 hover:border-sage/30 hover:bg-sage/[0.02]'
                              )}
                            >
                              <motion.span
                                aria-hidden
                                initial={false}
                                animate={{ scaleY: sel ? 1 : 0 }}
                                transition={SOFT_SPRING}
                                style={{ transformOrigin: 'center' }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-accent rounded-r-full"
                              />
                              <span className="flex-1 pl-1">
                                <span className="block font-medium text-sage text-[15px]">
                                  {o.label}
                                </span>
                                {o.description && (
                                  <span className="block text-xs text-sage/60 mt-0.5">
                                    {o.description}
                                  </span>
                                )}
                              </span>
                              {sel && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={SOFT_SPRING}
                                  className="mt-0.5 text-accent flex-shrink-0"
                                >
                                  <Check size={14} strokeWidth={2.5} />
                                </motion.span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'contact' && (
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {[
                          ['firstName', 'Prénom *'],
                          ['lastName', 'Nom *'],
                          ['email', 'Email *', 'email'],
                          ['phone', 'Téléphone'],
                          ['company', 'Entreprise'],
                        ].map(([name, label, type]) => (
                          <label key={name as string} className="block">
                            <span className="block text-xs font-medium text-sage/70 mb-1.5">
                              {label as string}
                            </span>
                            <input
                              type={(type as string) || 'text'}
                              value={(answers.contact?.[name as string] as string) || ''}
                              onChange={(e) =>
                                setAnswer('contact', {
                                  ...(answers.contact || {}),
                                  [name as string]: e.target.value,
                                })
                              }
                              className="input-base"
                            />
                          </label>
                        ))}
                        <label className="block sm:col-span-2">
                          <span className="block text-xs font-medium text-sage/70 mb-1.5">
                            Un mot pour la route ?
                          </span>
                          <textarea
                            rows={3}
                            value={answers.contact?.message || ''}
                            onChange={(e) =>
                              setAnswer('contact', {
                                ...(answers.contact || {}),
                                message: e.target.value,
                              })
                            }
                            className="input-base resize-none"
                          />
                        </label>
                      </div>
                    )}

                    {/* Pedagogical insight */}
                    {'insight' in q && q.insight && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mt-7 flex gap-3.5 rounded-2xl bg-gradient-to-br from-accent/15 via-accent/8 to-cream border border-accent/30 p-4 shadow-sm shadow-accent/10"
                      >
                        <div className="relative flex-shrink-0 mt-0.5">
                          <motion.span
                            aria-hidden
                            animate={{
                              scale: [1, 1.7, 1],
                              opacity: [0.55, 0, 0.55],
                            }}
                            transition={{
                              duration: 2.4,
                              repeat: Infinity,
                              ease: 'easeOut',
                            }}
                            className="absolute inset-0 -m-1 rounded-full bg-accent/60 blur-md motion-reduce:!animate-none motion-reduce:!opacity-30"
                          />
                          <Lightbulb
                            size={18}
                            className="relative text-accent"
                            fill="currentColor"
                          />
                        </div>
                        <p className="text-sm text-sage leading-relaxed">
                          {q.insight}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="px-6 md:px-10 py-4 border-t border-sage/10 flex items-center justify-between gap-3 bg-cream">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || submitting}
                  className="inline-flex items-center gap-1.5 text-sage/70 hover:text-sage disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  Retour
                </button>
                <button
                  onClick={goNext}
                  disabled={!canNext || submitting}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-sm transition-all',
                    canNext
                      ? 'bg-sage text-cream hover:bg-sage-700 hover:-translate-y-0.5'
                      : 'bg-sage/20 text-sage/40 cursor-not-allowed'
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi...
                    </>
                  ) : step === total - 1 ? (
                    <>
                      Envoyer
                      <Check size={16} />
                    </>
                  ) : (
                    <>
                      Continuer
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Loader2, Check, Star } from 'lucide-react';
import type { Subscription } from '@/lib/defaults';
import { cn } from '@/lib/utils';
import { MultilineListInput } from '../inputs';

function blank(): Subscription {
  return {
    id: `s_${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    price: '',
    cadence: '/ mois',
    bullets: [],
    featured: false,
  };
}

export default function SubscriptionsEditor({
  initial,
}: {
  initial: Subscription[];
}) {
  const [items, setItems] = useState<Subscription[]>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<Subscription>) {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  function remove(id: string) {
    if (!confirm('Supprimer cet abonnement ?')) return;
    setItems((a) => a.filter((i) => i.id !== id));
  }
  function add() {
    setItems((a) => [...a, blank()]);
  }
  function toggleFeatured(id: string) {
    setItems((arr) =>
      arr.map((i) => ({ ...i, featured: i.id === id ? !i.featured : false }))
    );
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setSavedAt(Date.now());
    } catch (e: any) {
      setError(e?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 sticky top-16 bg-cream/90 backdrop-blur z-20 -mx-6 md:-mx-10 lg:-mx-16 px-6 md:px-10 lg:px-16 py-4 border-b border-sage/10">
        <div>
          <h1 className="font-display text-3xl text-sage">Abonnements</h1>
          <p className="text-sage/60 text-sm mt-0.5">
            Marquez l'abonnement « phare » avec l'étoile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && Date.now() - savedAt < 4000 && (
            <span className="inline-flex items-center gap-1.5 text-moss-dark text-sm">
              <Check size={14} /> Enregistré
            </span>
          )}
          <button onClick={add} className="btn-secondary text-sm py-2.5 px-4">
            <Plus size={14} /> Nouveau
          </button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm py-2.5 px-4">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((s) => (
          <article key={s.id} className="card-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <button
                onClick={() => toggleFeatured(s.id)}
                aria-label="Mettre en avant"
                title="Mettre en avant"
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full transition-colors',
                  s.featured
                    ? 'bg-sage text-cream'
                    : 'bg-sage/5 text-sage hover:bg-sage/10'
                )}
              >
                <Star size={14} fill={s.featured ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => remove(s.id)}
                className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <Field label="Nom">
                <input
                  className="input-base"
                  value={s.name}
                  onChange={(e) => update(s.id, { name: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix">
                  <input
                    className="input-base"
                    value={s.price}
                    onChange={(e) => update(s.id, { price: e.target.value })}
                  />
                </Field>
                <Field label="Cadence">
                  <input
                    className="input-base"
                    value={s.cadence}
                    onChange={(e) => update(s.id, { cadence: e.target.value })}
                  />
                </Field>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!s.compact}
                  onChange={(e) => update(s.id, { compact: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-sage"
                />
                <span className="text-sm">
                  <span className="font-medium text-sage">
                    Afficher en mode option (compact)
                  </span>
                  <span className="block text-xs text-sage/60 mt-0.5">
                    Sera regroupé dans l'encart « Options à la carte » sous les cartes
                    principales (utile pour les modules courts comme la modération).
                  </span>
                </span>
              </label>
              <Field label="Bullets (un par ligne)">
                <MultilineListInput
                  rows={4}
                  value={s.bullets}
                  onChange={(bullets) => update(s.id, { bullets })}
                />
              </Field>

              <div className="pt-3 mt-1 border-t border-sage/10">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-sage">
                    Option associée
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage/45">
                    Facultatif
                  </span>
                </div>
                <p className="text-[11px] text-sage/55 mb-3 leading-relaxed">
                  Apparaît sur la carte sous les bullets, et comme supplément dans
                  la modale de contact rapide (ex. « Community Management +500€ »).
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nom de l'option">
                    <input
                      className="input-base"
                      value={s.addon?.name || ''}
                      placeholder="Community Management"
                      onChange={(e) => {
                        const name = e.target.value;
                        const price = s.addon?.price || '';
                        update(s.id, {
                          addon: name || price ? { name, price } : undefined,
                        });
                      }}
                    />
                  </Field>
                  <Field label="Prix">
                    <input
                      className="input-base"
                      value={s.addon?.price || ''}
                      placeholder="500€"
                      onChange={(e) => {
                        const price = e.target.value;
                        const name = s.addon?.name || '';
                        update(s.id, {
                          addon: name || price ? { name, price } : undefined,
                        });
                      }}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-sage/70 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

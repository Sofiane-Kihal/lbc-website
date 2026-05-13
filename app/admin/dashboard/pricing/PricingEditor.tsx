'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Loader2, Check, ChevronDown, ChevronRight } from 'lucide-react';
import type { PricingGroup, PricingItem } from '@/lib/defaults';
import { cn } from '@/lib/utils';

function blankItem(): PricingItem {
  return {
    id: `i_${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    price: '',
    bullets: [],
  };
}

function blankGroup(): PricingGroup {
  return {
    id: `g_${Math.random().toString(36).slice(2, 8)}`,
    title: 'Nouveau groupe',
    description: '',
    items: [],
  };
}

export default function PricingEditor({ initial }: { initial: PricingGroup[] }) {
  const [groups, setGroups] = useState<PricingGroup[]>(initial);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initial.map((g) => [g.id, true]))
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateGroup(id: string, patch: Partial<PricingGroup>) {
    setGroups((arr) => arr.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }
  function updateItem(gid: string, iid: string, patch: Partial<PricingItem>) {
    setGroups((arr) =>
      arr.map((g) =>
        g.id !== gid
          ? g
          : { ...g, items: g.items.map((i) => (i.id === iid ? { ...i, ...patch } : i)) }
      )
    );
  }
  function addGroup() {
    const g = blankGroup();
    setGroups((a) => [...a, g]);
    setOpenMap((m) => ({ ...m, [g.id]: true }));
  }
  function removeGroup(gid: string) {
    if (!confirm('Supprimer ce groupe et toutes ses lignes ?')) return;
    setGroups((a) => a.filter((g) => g.id !== gid));
  }
  function addItem(gid: string) {
    const i = blankItem();
    setGroups((arr) =>
      arr.map((g) => (g.id === gid ? { ...g, items: [...g.items, i] } : g))
    );
  }
  function removeItem(gid: string, iid: string) {
    setGroups((arr) =>
      arr.map((g) =>
        g.id !== gid ? g : { ...g, items: g.items.filter((i) => i.id !== iid) }
      )
    );
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: groups }),
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
          <h1 className="font-display text-3xl text-sage">Tarifs</h1>
          <p className="text-sage/60 text-sm mt-0.5">
            Organisez vos lignes tarifaires en groupes (Audit, Production, Options...).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && Date.now() - savedAt < 4000 && (
            <span className="inline-flex items-center gap-1.5 text-moss-dark text-sm">
              <Check size={14} /> Enregistré
            </span>
          )}
          <button onClick={addGroup} className="btn-secondary text-sm py-2.5 px-4">
            <Plus size={14} />
            Groupe
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

      <div className="space-y-6">
        {groups.map((g) => {
          const open = openMap[g.id];
          return (
            <section key={g.id} className="card-soft">
              <header className="flex items-center justify-between gap-3 p-5 border-b border-sage/10">
                <button
                  onClick={() =>
                    setOpenMap((m) => ({ ...m, [g.id]: !open }))
                  }
                  className="grid h-8 w-8 place-items-center rounded-full bg-sage/5 text-sage hover:bg-sage/10"
                  aria-label="Toggle"
                >
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <input
                  className="input-base flex-1"
                  value={g.title}
                  onChange={(e) => updateGroup(g.id, { title: e.target.value })}
                  placeholder="Nom du groupe"
                />
                <input
                  className="input-base flex-1 hidden md:block"
                  value={g.description || ''}
                  onChange={(e) => updateGroup(g.id, { description: e.target.value })}
                  placeholder="Description (optionnelle)"
                />
                <button
                  onClick={() => removeGroup(g.id)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                  aria-label="Supprimer le groupe"
                >
                  <Trash2 size={14} />
                </button>
              </header>

              <div className={cn('p-5 space-y-4', !open && 'hidden')}>
                {g.items.length === 0 && (
                  <p className="text-sm text-sage/50 italic">Aucune ligne pour l'instant.</p>
                )}
                {g.items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-sage/10 p-4 bg-white/60">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Nom">
                        <input
                          className="input-base"
                          value={it.name}
                          onChange={(e) =>
                            updateItem(g.id, it.id, { name: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Prix (texte libre)">
                        <input
                          className="input-base"
                          value={it.price}
                          onChange={(e) =>
                            updateItem(g.id, it.id, { price: e.target.value })
                          }
                          placeholder="ex. 990€"
                        />
                      </Field>
                      <Field label="Surtitre (optionnel)" className="md:col-span-2">
                        <input
                          className="input-base"
                          value={it.highlight || ''}
                          onChange={(e) =>
                            updateItem(g.id, it.id, { highlight: e.target.value })
                          }
                          placeholder="Idéal pour démarrer · Audience X"
                        />
                      </Field>
                      <Field label="Bullets (un par ligne)" className="md:col-span-2">
                        <textarea
                          rows={4}
                          className="input-base resize-y"
                          value={it.bullets.join('\n')}
                          onChange={(e) =>
                            updateItem(g.id, it.id, {
                              bullets: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </Field>
                      <Field
                        label="Niveaux / variantes (optionnel — un par ligne, format : Label | Prix)"
                        className="md:col-span-2"
                      >
                        <textarea
                          rows={3}
                          className="input-base resize-y font-mono text-sm"
                          placeholder={
                            '1 canal | 390€\n2 canaux | 590€\n3 canaux | 690€'
                          }
                          value={(it.tiers || [])
                            .map((t) => `${t.label} | ${t.price}`)
                            .join('\n')}
                          onChange={(e) => {
                            const parsed = e.target.value
                              .split('\n')
                              .map((line) => {
                                const [label, price] = line.split('|').map((x) =>
                                  x.trim()
                                );
                                return label && price ? { label, price } : null;
                              })
                              .filter((x): x is { label: string; price: string } =>
                                x !== null
                              );
                            updateItem(g.id, it.id, {
                              tiers: parsed.length > 0 ? parsed : undefined,
                            });
                          }}
                        />
                        <span className="block text-xs text-sage/60 mt-1.5">
                          Quand renseigné, la carte affiche un sélecteur de niveau et le
                          prix s'anime entre les variantes.
                        </span>
                      </Field>
                      <label className="md:col-span-2 flex items-start gap-3 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!it.compact}
                          onChange={(e) =>
                            updateItem(g.id, it.id, {
                              compact: e.target.checked,
                            })
                          }
                          className="mt-1 h-4 w-4 accent-sage"
                        />
                        <span className="text-sm">
                          <span className="font-medium text-sage">
                            Afficher en mode compact (option à la carte)
                          </span>
                          <span className="block text-xs text-sage/60 mt-0.5">
                            Sera regroupé dans un encart « Options à la carte » sous les
                            cartes principales du groupe.
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => removeItem(g.id, it.id)}
                        className="text-sm text-red-700 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Supprimer la ligne
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem(g.id)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  <Plus size={14} />
                  Ajouter une ligne
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </>
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

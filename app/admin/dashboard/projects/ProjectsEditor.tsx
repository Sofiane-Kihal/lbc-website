'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, Loader2, Check } from 'lucide-react';
import type { Project } from '@/lib/defaults';
import { slugify } from '@/lib/utils';

const COVER_PRESETS = [
  'gradient:sage→moss',
  'gradient:moss→stone',
  'gradient:sage→stone',
  'gradient:stone→cream',
  'gradient:moss→sage',
  'gradient:sage→cream',
];

function blank(): Project {
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    slug: '',
    title: '',
    client: '',
    category: '',
    year: String(new Date().getFullYear()),
    cover: 'gradient:sage→moss',
    description: '',
    scope: [],
  };
}

export default function ProjectsEditor({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<Project>) {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function move(id: string, dir: -1 | 1) {
    setItems((arr) => {
      const idx = arr.findIndex((i) => i.id === id);
      if (idx < 0) return arr;
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return arr;
      const next = arr.slice();
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function remove(id: string) {
    if (!confirm('Supprimer ce projet ?')) return;
    setItems((arr) => arr.filter((i) => i.id !== id));
  }

  function add() {
    setItems((arr) => [...arr, blank()]);
  }

  async function save() {
    // Auto-fill slugs.
    const normalized = items.map((p) => ({
      ...p,
      slug: p.slug || slugify(p.title || p.id),
    }));
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setItems(normalized);
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
          <h1 className="font-display text-3xl text-sage">Projets</h1>
          <p className="text-sage/60 text-sm mt-0.5">
            Ajoutez, modifiez, ré-ordonnez vos réalisations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && Date.now() - savedAt < 4000 && (
            <span className="inline-flex items-center gap-1.5 text-moss-dark text-sm">
              <Check size={14} /> Enregistré
            </span>
          )}
          <button onClick={add} className="btn-secondary text-sm py-2.5 px-4">
            <Plus size={14} />
            Nouveau projet
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

      <div className="space-y-4">
        {items.map((p, idx) => (
          <article key={p.id} className="card-soft p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1 text-sage/40">
                <button
                  onClick={() => move(p.id, -1)}
                  disabled={idx === 0}
                  className="hover:text-sage disabled:opacity-30"
                  aria-label="Monter"
                >
                  ▲
                </button>
                <GripVertical size={14} />
                <button
                  onClick={() => move(p.id, 1)}
                  disabled={idx === items.length - 1}
                  className="hover:text-sage disabled:opacity-30"
                  aria-label="Descendre"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1 grid gap-3 md:grid-cols-2">
                <Field label="Titre">
                  <input
                    className="input-base"
                    value={p.title}
                    onChange={(e) => update(p.id, { title: e.target.value })}
                  />
                </Field>
                <Field label="Slug (URL)">
                  <input
                    className="input-base"
                    placeholder="auto à partir du titre"
                    value={p.slug}
                    onChange={(e) =>
                      update(p.id, { slug: slugify(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Client">
                  <input
                    className="input-base"
                    value={p.client}
                    onChange={(e) => update(p.id, { client: e.target.value })}
                  />
                </Field>
                <Field label="Catégorie">
                  <input
                    className="input-base"
                    value={p.category}
                    onChange={(e) => update(p.id, { category: e.target.value })}
                  />
                </Field>
                <Field label="Année">
                  <input
                    className="input-base"
                    value={p.year}
                    onChange={(e) => update(p.id, { year: e.target.value })}
                  />
                </Field>
                <Field label="Couverture (URL ou dégradé)">
                  <div className="space-y-2">
                    <input
                      className="input-base"
                      value={p.cover}
                      onChange={(e) => update(p.id, { cover: e.target.value })}
                      placeholder="https://… ou gradient:sage→moss"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {COVER_PRESETS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => update(p.id, { cover: g })}
                          className="text-[11px] rounded-full px-2.5 py-1 bg-sage/5 hover:bg-sage hover:text-cream transition-colors"
                        >
                          {g.replace('gradient:', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>
                <Field label="Description" className="md:col-span-2">
                  <textarea
                    rows={3}
                    className="input-base resize-none"
                    value={p.description}
                    onChange={(e) => update(p.id, { description: e.target.value })}
                  />
                </Field>
                <Field label="Scope (séparé par des virgules)" className="md:col-span-2">
                  <input
                    className="input-base"
                    value={p.scope.join(', ')}
                    onChange={(e) =>
                      update(p.id, {
                        scope: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
              </div>

              <button
                onClick={() => remove(p.id)}
                aria-label="Supprimer"
                className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={add} className="btn-secondary">
          <Plus size={16} />
          Ajouter un projet
        </button>
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

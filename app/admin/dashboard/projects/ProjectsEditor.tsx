'use client';

import { useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  Check,
  Upload,
  ImageIcon,
  Star,
} from 'lucide-react';
import type { Project } from '@/lib/defaults';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils';

const COVER_PRESETS = [
  'gradient:sage→moss',
  'gradient:moss→stone',
  'gradient:sage→stone',
  'gradient:stone→cream',
  'gradient:moss→sage',
  'gradient:sage→cream',
];

const GRADIENT_PREVIEWS: Record<string, string> = {
  'gradient:sage→moss': 'linear-gradient(135deg, #5d6ef4 0%, #010101 100%)',
  'gradient:moss→stone': 'linear-gradient(135deg, #010101 0%, #C7C0AE 100%)',
  'gradient:sage→stone': 'linear-gradient(135deg, #5d6ef4 0%, #C7C0AE 100%)',
  'gradient:stone→cream': 'linear-gradient(135deg, #C7C0AE 0%, #FAF1E6 100%)',
  'gradient:moss→sage': 'linear-gradient(135deg, #010101 0%, #5d6ef4 100%)',
  'gradient:sage→cream': 'linear-gradient(135deg, #5d6ef4 0%, #FAF1E6 100%)',
};

function blank(): Project {
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    slug: '',
    title: '',
    client: '',
    categories: [],
    year: String(new Date().getFullYear()),
    cover: 'gradient:sage→moss',
    coverAlt: '',
    description: '',
    scope: [],
    metaTitle: '',
    metaDescription: '',
  };
}

function isImageCover(cover: string) {
  return cover.startsWith('http') || cover.startsWith('/api/media/');
}

export default function ProjectsEditor({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function update(id: string, patch: Partial<Project>) {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  // Featured-in-hero is exclusive: enabling one project disables the others.
  function toggleFeatured(id: string) {
    setItems((arr) =>
      arr.map((p) => ({
        ...p,
        featured: p.id === id ? !p.featured : false,
      }))
    );
  }

  async function uploadCover(id: string, file: File) {
    setUploadingId(id);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      update(id, { cover: data.url });
    } catch (e: any) {
      setError(e?.message || 'Erreur upload');
    } finally {
      setUploadingId(null);
    }
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
                <Field label="Catégories (séparées par des virgules)">
                  <input
                    className="input-base"
                    value={p.categories.join(', ')}
                    placeholder="Ex. : Stratégie 360°, Film de marque"
                    onChange={(e) =>
                      update(p.id, {
                        categories: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
                <Field label="Année">
                  <input
                    className="input-base"
                    value={p.year}
                    onChange={(e) => update(p.id, { year: e.target.value })}
                  />
                </Field>
                <div className="md:col-span-2">
                  <CoverEditor
                    project={p}
                    uploading={uploadingId === p.id}
                    onChange={(patch) => update(p.id, patch)}
                    onUpload={(file) => uploadCover(p.id, file)}
                  />
                </div>
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

                <div className="md:col-span-2 mt-2 pt-5 border-t border-sage/10">
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-sage">SEO</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sage/50">
                      Optionnel · améliore le référencement
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Meta title (titre de la page)">
                      <input
                        className="input-base"
                        value={p.metaTitle || ''}
                        placeholder={p.title ? `${p.title} — La Bande Créative` : 'Titre SEO'}
                        onChange={(e) => update(p.id, { metaTitle: e.target.value })}
                      />
                      <span className="block text-[11px] text-sage/55 mt-1">
                        ~60 caractères max recommandé
                        {p.metaTitle ? ` · ${p.metaTitle.length}` : ''}
                      </span>
                    </Field>
                    <Field label="Meta description">
                      <textarea
                        rows={2}
                        className="input-base resize-none"
                        value={p.metaDescription || ''}
                        placeholder="Résumé qui apparaît dans Google (150-160 caractères)."
                        onChange={(e) =>
                          update(p.id, { metaDescription: e.target.value })
                        }
                      />
                      <span className="block text-[11px] text-sage/55 mt-1">
                        ~155 caractères max recommandé
                        {p.metaDescription ? ` · ${p.metaDescription.length}` : ''}
                      </span>
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleFeatured(p.id)}
                  aria-label={
                    p.featured
                      ? 'Retirer de la mise en avant du Hero'
                      : 'Mettre en avant dans le Hero'
                  }
                  title={
                    p.featured
                      ? 'Retirer de la mise en avant du Hero'
                      : 'Mettre en avant dans le Hero'
                  }
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-full transition-colors',
                    p.featured
                      ? 'bg-accent text-cream shadow-md shadow-accent/40'
                      : 'bg-sage/5 text-sage hover:bg-sage/10'
                  )}
                >
                  <Star
                    size={14}
                    fill={p.featured ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  aria-label="Supprimer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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

function CoverEditor({
  project,
  uploading,
  onChange,
  onUpload,
}: {
  project: Project;
  uploading: boolean;
  onChange: (patch: Partial<Project>) => void;
  onUpload: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isImage = isImageCover(project.cover);
  const isGradient = project.cover.startsWith('gradient:');

  const previewStyle: React.CSSProperties = isGradient
    ? { backgroundImage: GRADIENT_PREVIEWS[project.cover] || GRADIENT_PREVIEWS['gradient:sage→moss'] }
    : isImage
      ? {
          backgroundImage: `url(${project.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { backgroundColor: '#C7C0AE' };

  return (
    <div className="grid gap-3 md:grid-cols-[140px_1fr]">
      <div
        className="aspect-[4/5] rounded-xl border border-sage/15 overflow-hidden grid place-items-center text-sage/30"
        style={previewStyle}
        aria-label={project.coverAlt || 'Aperçu de la couverture'}
      >
        {!isImage && !isGradient && <ImageIcon size={28} />}
      </div>

      <div className="space-y-2.5">
        <Field label="Couverture (URL, gradient, ou fichier importé)">
          <div className="flex gap-2">
            <input
              className="input-base flex-1"
              value={project.cover}
              onChange={(e) => onChange({ cover: e.target.value })}
              placeholder="https://… ou gradient:sage→moss"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-sage text-cream hover:bg-sage-700 disabled:opacity-60 disabled:cursor-not-allowed px-3.5 text-xs font-medium transition-colors whitespace-nowrap"
            >
              {uploading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Envoi…
                </>
              ) : (
                <>
                  <Upload size={12} />
                  Importer
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = '';
              }}
            />
          </div>
        </Field>

        <div className="flex flex-wrap gap-1.5">
          {COVER_PRESETS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange({ cover: g })}
              className="text-[11px] rounded-full px-2.5 py-1 bg-sage/5 hover:bg-sage hover:text-cream transition-colors"
            >
              {g.replace('gradient:', '')}
            </button>
          ))}
        </div>

        <Field label="Texte alternatif de l'image (alt)">
          <input
            className="input-base"
            value={project.coverAlt || ''}
            placeholder="Ex. : Affiche de la campagne Maison Laurel, gros plan sur un parfum"
            onChange={(e) => onChange({ coverAlt: e.target.value })}
            disabled={isGradient}
          />
          <span className="block text-[11px] text-sage/55 mt-1">
            {isGradient
              ? 'Inutile pour un dégradé décoratif.'
              : 'Décrit l\'image pour le SEO et l\'accessibilité.'}
          </span>
        </Field>
      </div>
    </div>
  );
}

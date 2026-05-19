'use client';

import { useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Check,
  Upload,
  ImageIcon,
} from 'lucide-react';
import type { Banners, LogoItem } from '@/lib/defaults';
import { uploadMedia } from '../upload';

function blankLogo(): LogoItem {
  return {
    id: `l_${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    monochrome: true,
  };
}

export default function BannersEditor({ initial }: { initial: Banners }) {
  const [logos, setLogos] = useState<LogoItem[]>(initial.logos);
  const [slogans, setSlogans] = useState<string[]>(initial.slogans);
  const [heroCaption, setHeroCaption] = useState<string>(initial.heroStrip.caption);
  const [heroLogos, setHeroLogos] = useState<LogoItem[]>(initial.heroStrip.logos);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Both the marquee and the hero strip share the same logo shape and the
  // same set of mutations — these helpers parameterize on the setter.
  function makeLogoOps(setter: React.Dispatch<React.SetStateAction<LogoItem[]>>) {
    return {
      update(id: string, patch: Partial<LogoItem>) {
        setter((arr) =>
          arr.map((l) => (l === undefined || l.id !== id ? l : { ...l, ...patch }))
        );
      },
      move(id: string, dir: -1 | 1) {
        setter((arr) => {
          const idx = arr.findIndex((l) => l.id === id);
          if (idx < 0) return arr;
          const j = idx + dir;
          if (j < 0 || j >= arr.length) return arr;
          const next = arr.slice();
          [next[idx], next[j]] = [next[j], next[idx]];
          return next;
        });
      },
      remove(id: string) {
        setter((arr) => arr.filter((l) => l.id !== id));
      },
      async upload(id: string, file: File) {
        setUploadingId(id);
        setError(null);
        try {
          const { url } = await uploadMedia(file);
          setter((arr) =>
            arr.map((l) => (l.id === id ? { ...l, image: url } : l))
          );
        } catch (e: any) {
          setError(e?.message || 'Erreur upload');
        } finally {
          setUploadingId(null);
        }
      },
    };
  }
  const marqueeOps = makeLogoOps(setLogos);
  const heroOps = makeLogoOps(setHeroLogos);

  function moveSlogan(idx: number, dir: -1 | 1) {
    setSlogans((arr) => {
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return arr;
      const next = arr.slice();
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const cleaned: Banners = {
        logos: logos.filter((l) => l.name.trim() || l.image),
        slogans: slogans.map((s) => s.trim()).filter(Boolean),
        heroStrip: {
          caption: heroCaption.trim(),
          logos: heroLogos.filter((l) => l.name.trim() || l.image),
        },
      };
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setLogos(cleaned.logos);
      setSlogans(cleaned.slogans);
      setHeroCaption(cleaned.heroStrip.caption);
      setHeroLogos(cleaned.heroStrip.logos);
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
          <h1 className="font-display text-3xl text-sage">Banderoles</h1>
          <p className="text-sage/60 text-sm mt-0.5">
            Les deux bandeaux défilants : logos clients (sous le hero) et
            slogans (avant les tarifs).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && Date.now() - savedAt < 4000 && (
            <span className="inline-flex items-center gap-1.5 text-sage text-sm">
              <Check size={14} /> Enregistré
            </span>
          )}
          <button onClick={save} disabled={saving} className="btn-primary text-sm py-2.5 px-4">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      {/* --- HERO STRIP — caption + small avatar logos --- */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl text-sage">Encart du Hero</h2>
            <p className="text-sage/60 text-sm mt-1">
              Le petit bloc juste sous les CTA du Hero : une phrase courte et
              une rangée de logos « pastilles » empilés. Laisser vide pour
              cacher l'encart sur le site.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Phrase affichée à côté des pastilles">
            <input
              className="input-base"
              value={heroCaption}
              placeholder="Ex. : + d'une vingtaine de marques accompagnées en 2025"
              onChange={(e) => setHeroCaption(e.target.value)}
            />
          </Field>

          <LogoList
            logos={heroLogos}
            ops={heroOps}
            uploadingId={uploadingId}
            onAdd={() => setHeroLogos((arr) => [...arr, blankLogo()])}
            namePlaceholder="Ex. : Maison Laurel"
            addLabel="Ajouter une pastille"
          />
        </div>
      </section>

      {/* --- LOGOS --- */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl text-sage">1er bandeau · logos clients</h2>
            <p className="text-sage/60 text-sm mt-1">
              Importez vos logos (PNG, SVG, WebP…). Sur le site, ils sont rendus en
              monochrome cream par défaut pour rester cohérents sur le fond indigo.
              Désactivez l'option si vous voulez garder les couleurs d'origine.
            </p>
          </div>
        </div>

        <LogoList
          logos={logos}
          ops={marqueeOps}
          uploadingId={uploadingId}
          onAdd={() => setLogos((arr) => [...arr, blankLogo()])}
          namePlaceholder="Ex. : Maison Laurel"
          addLabel="Ajouter un logo"
        />
      </section>

      {/* --- SLOGANS --- */}
      <section>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl text-sage">
              2e bandeau · slogans défilants
            </h2>
            <p className="text-sage/60 text-sm mt-1">
              Phrases courtes affichées sur le bandeau noir, séparées par un point
              orange. Tutoyez à votre guise, gardez le rythme.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {slogans.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 card-soft px-4 py-2.5"
            >
              <div className="flex flex-col gap-0.5 text-sage/40">
                <button
                  onClick={() => moveSlogan(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Monter"
                  className="hover:text-sage disabled:opacity-30 text-xs leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveSlogan(idx, 1)}
                  disabled={idx === slogans.length - 1}
                  aria-label="Descendre"
                  className="hover:text-sage disabled:opacity-30 text-xs leading-none"
                >
                  ▼
                </button>
              </div>
              <input
                className="input-base flex-1"
                value={s}
                placeholder="Ex. : On allie créa & perfo"
                onChange={(e) =>
                  setSlogans((arr) => arr.map((v, i) => (i === idx ? e.target.value : v)))
                }
              />
              <button
                onClick={() => setSlogans((arr) => arr.filter((_, i) => i !== idx))}
                aria-label="Supprimer"
                className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setSlogans((arr) => [...arr, ''])}
          className="btn-secondary mt-4"
        >
          <Plus size={16} />
          Ajouter un slogan
        </button>
      </section>
    </>
  );
}

type LogoOps = {
  update: (id: string, patch: Partial<LogoItem>) => void;
  move: (id: string, dir: -1 | 1) => void;
  remove: (id: string) => void;
  upload: (id: string, file: File) => void;
};

function LogoList({
  logos,
  ops,
  uploadingId,
  onAdd,
  namePlaceholder,
  addLabel,
}: {
  logos: LogoItem[];
  ops: LogoOps;
  uploadingId: string | null;
  onAdd: () => void;
  namePlaceholder: string;
  addLabel: string;
}) {
  return (
    <>
      <div className="space-y-3">
        {logos.map((l, idx) => (
          <article key={l.id} className="card-soft p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-[88px_1fr_auto] items-start">
              <LogoPreview logo={l} />

              <div className="grid gap-2.5 md:grid-cols-2">
                <Field label="Nom du client (alt + fallback texte)">
                  <input
                    className="input-base"
                    value={l.name}
                    placeholder={namePlaceholder}
                    onChange={(e) => ops.update(l.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Image (importée ou URL)">
                  <div className="flex gap-2">
                    <input
                      className="input-base flex-1"
                      value={l.image || ''}
                      placeholder="Importez un fichier ou collez une URL"
                      onChange={(e) => ops.update(l.id, { image: e.target.value })}
                    />
                    <UploadButton
                      uploading={uploadingId === l.id}
                      onPick={(file) => ops.upload(l.id, file)}
                    />
                  </div>
                </Field>
                <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-sage/80 mt-1">
                  <input
                    type="checkbox"
                    checked={l.monochrome ?? true}
                    onChange={(e) => ops.update(l.id, { monochrome: e.target.checked })}
                    className="h-4 w-4 rounded border-sage/30 text-sage focus:ring-sage/30"
                  />
                  Affichage monochrome cream (recommandé sur le fond indigo)
                </label>
              </div>

              <div className="flex md:flex-col gap-1.5 items-center">
                <button
                  onClick={() => ops.move(l.id, -1)}
                  disabled={idx === 0}
                  aria-label="Monter"
                  className="grid h-8 w-8 place-items-center rounded-full text-sage/50 hover:text-sage hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ▲
                </button>
                <button
                  onClick={() => ops.move(l.id, 1)}
                  disabled={idx === logos.length - 1}
                  aria-label="Descendre"
                  className="grid h-8 w-8 place-items-center rounded-full text-sage/50 hover:text-sage hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ▼
                </button>
                <button
                  onClick={() => ops.remove(l.id)}
                  aria-label="Supprimer"
                  className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button onClick={onAdd} className="btn-secondary mt-4">
        <Plus size={16} />
        {addLabel}
      </button>
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

function UploadButton({
  uploading,
  onPick,
}: {
  uploading: boolean;
  onPick: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
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
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
    </>
  );
}

function LogoPreview({ logo }: { logo: LogoItem }) {
  if (logo.image) {
    return (
      <div className="grid place-items-center h-16 w-full rounded-xl bg-sage/95 p-2">
        <img
          src={logo.image}
          alt={logo.name || 'Logo'}
          className="max-h-full max-w-full object-contain"
          style={
            (logo.monochrome ?? true)
              ? { filter: 'brightness(0) invert(1)', opacity: 0.92 }
              : undefined
          }
        />
      </div>
    );
  }
  return (
    <div className="grid place-items-center h-16 w-full rounded-xl bg-sage/5 text-sage/40">
      <ImageIcon size={20} />
    </div>
  );
}

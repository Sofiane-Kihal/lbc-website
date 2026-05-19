import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProjects } from '@/lib/storage';
import { coverStyle } from '@/lib/colors';
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbLd,
  creativeWorkLd,
  jsonLdScript,
} from '@/lib/seo';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

function buildDescription(project: {
  description: string;
  metaDescription?: string;
  categories: string[];
  client: string;
  year: string;
}) {
  if (project.metaDescription) return project.metaDescription;
  const base =
    project.description?.trim() ||
    `Projet ${project.categories.join(', ')} réalisé pour ${project.client} en ${project.year}.`;
  // 160 chars max — Google tronque au-delà. On garde le sens en coupant au
  // dernier mot complet.
  if (base.length <= 160) return base;
  return base.slice(0, 157).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return {
      title: 'Projet introuvable',
      robots: { index: false, follow: false },
    };
  }

  const title =
    project.metaTitle ||
    `${project.title} — ${project.categories.join(', ')} | ${SITE_NAME}`;
  const description = buildDescription(project);
  const ogImage =
    project.cover.startsWith('http') || project.cover.startsWith('/api/media/')
      ? project.cover
      : undefined;
  const url = `${SITE_URL}/projets/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE_NAME,
      images: ogImage
        ? [{ url: ogImage, alt: project.coverAlt || project.title }]
        : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.id !== project.id).slice(0, 3);

  const breadcrumb = breadcrumbLd([
    { name: 'Accueil', url: `${SITE_URL}/` },
    { name: 'Projets', url: `${SITE_URL}/#projets` },
    { name: project.title, url: `${SITE_URL}/projets/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(creativeWorkLd(project))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumb)}
      />
      <header className="bg-cream sticky top-0 z-30 border-b border-sage/10">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sage hover:text-sage-700 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          <span className="font-display text-sage">La Bande Créative</span>
        </div>
      </header>

      <main className="bg-cream text-sage">
        <section
          className="relative h-[60vh] min-h-[400px] grain"
          style={coverStyle(project.cover)}
          aria-label={
            project.coverAlt || `${project.title} — ${project.categories.join(', ')}`
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-sage/85 via-sage/30 to-transparent" />
          <div className="container-wide relative h-full flex flex-col justify-end pb-16 text-cream">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest">
                {project.year}
              </span>
              {project.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest"
                >
                  {c}
                </span>
              ))}
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              {project.title}
            </h1>
            <p className="mt-3 text-cream/80">{project.client}</p>
          </div>
        </section>

        <section className="container-narrow py-20">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-display text-3xl text-sage">Le projet</h2>
              <p className="mt-5 text-sage/80 text-lg leading-relaxed">
                {project.description}
              </p>
              <p className="mt-6 text-sage/60 italic">
                Cette page sera enrichie prochainement avec les visuels, vidéos et chiffres
                clés du projet.
              </p>
            </div>
            <aside>
              <h3 className="font-display text-xl text-sage">Périmètre</h3>
              <ul className="mt-4 space-y-2">
                {project.scope.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-sage/5 border border-sage/10 px-4 py-1.5 text-sm text-sage inline-block mr-2 mb-2"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {others.length > 0 && (
          <section className="bg-stone/30 py-20">
            <div className="container-wide">
              <h2 className="font-display text-3xl text-sage mb-8">
                D'autres projets
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                {others.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projets/${p.slug}`}
                    className="group block relative aspect-[4/5] rounded-3xl overflow-hidden"
                    style={coverStyle(p.cover)}
                    aria-label={p.coverAlt || `${p.title} — ${p.categories.join(', ')}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-sage/85 via-sage/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-cream/85 text-sage transition-transform group-hover:rotate-45">
                      <ArrowUpRight size={14} />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-cream">
                      <div className="text-xs uppercase tracking-widest opacity-80">
                        {p.categories.join(' · ')}
                      </div>
                      <div className="font-display text-2xl mt-1">{p.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

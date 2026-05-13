import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProjects } from '@/lib/storage';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

const gradients: Record<string, string> = {
  'gradient:sage→moss': 'linear-gradient(135deg, #5d6ef4 0%, #010101 100%)',
  'gradient:moss→stone': 'linear-gradient(135deg, #010101 0%, #C7C0AE 100%)',
  'gradient:sage→stone': 'linear-gradient(135deg, #5d6ef4 0%, #C7C0AE 100%)',
  'gradient:stone→cream': 'linear-gradient(135deg, #C7C0AE 0%, #FAF1E6 100%)',
  'gradient:moss→sage': 'linear-gradient(135deg, #010101 0%, #5d6ef4 100%)',
  'gradient:sage→cream': 'linear-gradient(135deg, #5d6ef4 0%, #FAF1E6 100%)',
};

function coverStyle(cover: string): React.CSSProperties {
  if (cover?.startsWith('gradient:')) {
    return { backgroundImage: gradients[cover] || gradients['gradient:sage→moss'] };
  }
  if (cover?.startsWith('http')) {
    return {
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { backgroundImage: gradients['gradient:sage→moss'] };
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

  return (
    <>
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

      <main>
        <section className="relative h-[60vh] min-h-[400px] grain" style={coverStyle(project.cover)}>
          <div className="absolute inset-0 bg-gradient-to-t from-sage/85 via-sage/30 to-transparent" />
          <div className="container-wide relative h-full flex flex-col justify-end pb-16 text-cream">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest">
                {project.year}
              </span>
              <span className="rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest">
                {project.category}
              </span>
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
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-sage/85 via-sage/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-cream/85 text-sage transition-transform group-hover:rotate-45">
                      <ArrowUpRight size={14} />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-cream">
                      <div className="text-xs uppercase tracking-widest opacity-80">
                        {p.category}
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

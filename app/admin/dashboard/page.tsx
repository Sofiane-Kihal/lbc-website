import Link from 'next/link';
import { Briefcase, Tag, Repeat } from 'lucide-react';
import {
  getProjects,
  getPricing,
  getSubscriptions,
} from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
  const [projects, pricing, subscriptions] = await Promise.all([
    getProjects(),
    getPricing(),
    getSubscriptions(),
  ]);

  const cards = [
    {
      label: 'Projets',
      value: projects.length,
      href: '/admin/dashboard/projects',
      icon: Briefcase,
    },
    {
      label: 'Lignes tarifaires',
      value: pricing.reduce((acc, g) => acc + g.items.length, 0),
      href: '/admin/dashboard/pricing',
      icon: Tag,
    },
    {
      label: 'Abonnements',
      value: subscriptions.length,
      href: '/admin/dashboard/subscriptions',
      icon: Repeat,
    },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="font-display text-4xl text-sage">Bienvenue 👋</h1>
        <p className="mt-2 text-sage/70">
          Pilotez vos projets, tarifs et abonnements depuis un seul endroit.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="card-soft p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sage/10 text-sage group-hover:bg-sage group-hover:text-cream transition-colors">
                  <Icon size={20} />
                </div>
                <span className="font-display text-5xl text-sage">{c.value}</span>
              </div>
              <div className="mt-4">
                <div className="font-display text-2xl text-sage">{c.label}</div>
                <div className="text-sm text-sage/60 mt-1">Gérer →</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 card-soft p-6">
        <h2 className="font-display text-2xl text-sage">À savoir</h2>
        <ul className="mt-4 space-y-2 text-sm text-sage/75 list-disc pl-5">
          <li>
            Les modifications sont enregistrées sur Netlify Blobs et reflétées immédiatement
            sur le site public.
          </li>
          <li>
            Les emails autorisés se gèrent via la variable d'environnement{' '}
            <code className="bg-sage/10 rounded px-1.5 py-0.5">ADMIN_EMAILS</code>.
          </li>
          <li>
            Pour ajouter une image de couverture à un projet, collez une URL d'image (Unsplash,
            Cloudinary…) ou utilisez l'un des dégradés prédéfinis.
          </li>
        </ul>
      </div>
    </>
  );
}

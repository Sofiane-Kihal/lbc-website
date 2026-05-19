import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page introuvable',
  description: 'Cette page n\'existe pas (ou plus).',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 bg-cream relative grain">
      <div className="text-center max-w-md">
        <h1 className="font-display text-7xl text-sage">404</h1>
        <p className="mt-3 text-sage/70">
          Cette page n'existe pas (ou plus). Pas de panique.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}

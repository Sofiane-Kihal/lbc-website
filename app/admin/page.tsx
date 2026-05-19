import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Espace admin',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const { next } = await searchParams;
  if (session) redirect(next || '/admin/dashboard');

  return (
    <main className="min-h-screen grid place-items-center px-6 py-16 bg-cream relative grain">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-moss/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-stone/40 blur-[120px]" />

      <div className="relative w-full max-w-md card-soft p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="grid mx-auto h-12 w-12 place-items-center rounded-full bg-sage text-cream font-display text-xl">
            L
          </span>
          <h1 className="font-display mt-4 text-3xl text-sage">Espace admin</h1>
          <p className="mt-2 text-sage/60 text-sm">
            Réservé à l'équipe La Bande Créative.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}

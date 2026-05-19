import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';
import NavTabs from './NavTabs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin');

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-sage text-cream sticky top-0 z-30">
        <div className="container-wide flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="grid h-8 w-8 place-items-center rounded-full bg-cream text-sage font-display">
              L
            </Link>
            <div className="leading-tight">
              <div className="font-display text-lg">Admin · La Bande Créative</div>
              <div className="text-xs text-cream/70">{session.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm hidden md:inline-block text-cream/80 hover:text-cream"
            >
              ↗ Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <NavTabs />

      <main className="container-wide py-10">{children}</main>
    </div>
  );
}

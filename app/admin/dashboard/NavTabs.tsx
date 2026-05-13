'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Tag, Repeat, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/admin/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
  { href: '/admin/dashboard/projects', label: 'Projets', icon: Briefcase },
  { href: '/admin/dashboard/pricing', label: 'Tarifs', icon: Tag },
  { href: '/admin/dashboard/subscriptions', label: 'Abonnements', icon: Repeat },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/60 backdrop-blur border-b border-sage/10">
      <div className="container-wide flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname?.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
                active
                  ? 'border-sage text-sage'
                  : 'border-transparent text-sage/60 hover:text-sage'
              )}
            >
              <Icon size={15} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

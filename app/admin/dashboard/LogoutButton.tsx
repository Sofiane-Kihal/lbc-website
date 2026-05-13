'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 hover:bg-cream/20 px-3 py-1.5 text-sm transition-colors"
    >
      <LogOut size={14} />
      Déconnexion
    </button>
  );
}

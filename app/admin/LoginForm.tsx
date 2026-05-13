'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
      router.push(next || '/admin/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-xs font-medium text-sage/70 mb-1.5">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="input-base"
          placeholder="vous@labandecreative.com"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-medium text-sage/70 mb-1.5">Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="input-base"
        />
      </label>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <LogIn size={16} />
            Se connecter
          </>
        )}
      </button>

      <p className="text-xs text-sage/50 text-center pt-2">
        Seuls les emails autorisés peuvent se connecter.
      </p>
    </form>
  );
}

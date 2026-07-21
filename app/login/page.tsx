'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { ShieldAlert, Lock, User } from 'lucide-react';
import api, { setStoredToken } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (res.data.access_token) {
        setStoredToken(res.data.access_token);
        router.push('/dashboard');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      const detail =
        err instanceof AxiosError
          ? err.response?.data?.detail
          : undefined;
      setError(detail ?? 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-on-surface">
      <div className="scan-line"></div>
      <div className="glass-panel z-10 w-full max-w-md space-y-8 rounded-lg border border-outline-variant/30 p-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed-dim/10 inner-glow-cyan">
            <ShieldAlert className="h-8 w-8 text-primary-fixed-dim" />
          </div>
          <h1 className="font-headline-md text-[24px] font-bold tracking-tight text-on-surface">
            NIDS Platform
          </h1>
          <p className="mt-2 font-body-md text-[14px] text-on-surface-variant">
            Sign in to your security operations center
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded border border-secondary-container/30 bg-secondary-container/15 p-3 font-body-md text-[14px] text-secondary-container">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full rounded border border-outline-variant/40 bg-surface-container py-2 pl-10 pr-3 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full rounded border border-outline-variant/40 bg-surface-container py-2 pl-10 pr-3 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded bg-primary-fixed-dim/20 px-4 py-2.5 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30 focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

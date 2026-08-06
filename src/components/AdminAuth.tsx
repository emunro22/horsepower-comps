'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 w-fit"><Logo size="lg" /></div>
          <h1 className="text-2xl font-black text-foreground mb-2">Admin Access Required</h1>
          <p className="text-muted text-sm font-medium mb-6">
            {user ? 'Your account does not have admin privileges.' : 'Please log in with an admin account to access this area.'}
          </p>
          <Link
            href={user ? '/' : '/auth/login'}
            className="inline-flex px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02]"
          >
            {user ? 'Back to Home' : 'Log In'}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push(`/auth/reset-password?email=${encodeURIComponent(email.toLowerCase())}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="animate-fade-in-up w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="mx-auto w-fit"><Logo size="xl" /></div>
          </Link>
          <h1 className="text-2xl font-black text-foreground mb-2">Forgot Password?</h1>
          <p className="text-muted font-medium">Enter your email and we&apos;ll send you a reset code</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Sending code...' : 'Send Reset Code'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6 font-medium">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-light font-bold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

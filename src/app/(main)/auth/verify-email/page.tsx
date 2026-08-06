'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { refresh } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
        setLoading(false);
        return;
      }

      await refresh();
      router.push('/account');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess('A new code has been sent to your email');
        setCountdown(60);
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground mb-4">No email provided</h1>
          <p className="text-muted mb-6">Please register or log in first.</p>
          <Link href="/auth/register" className="text-primary hover:text-primary-light font-bold">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="animate-fade-in-up w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="mx-auto w-fit"><Logo size="xl" /></div>
          </Link>
          <h1 className="text-2xl font-black text-foreground mb-2">Verify Your Email</h1>
          <p className="text-muted font-medium">
            We sent a 6-digit code to <span className="text-foreground font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 text-success text-sm font-semibold rounded-xl p-3">
              {success}
            </div>
          )}

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 bg-background border-2 border-border rounded-xl text-center text-2xl font-black text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            ))}
          </div>

          <p className="text-center text-xs text-muted">Code expires in 5 minutes</p>

          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="text-sm text-primary hover:text-primary-light font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : resending
                  ? 'Sending...'
                  : "Didn't get a code? Resend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

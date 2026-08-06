'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

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

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
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
      } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground mb-4">No email provided</h1>
          <p className="text-muted mb-6">Please start from the forgot password page.</p>
          <Link href="/auth/forgot-password" className="text-primary hover:text-primary-light font-bold">
            Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="animate-fade-in-up w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-3xl mx-auto mb-6">
            &#10003;
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Password Reset!</h1>
          <p className="text-muted font-medium">Your password has been updated. Redirecting to login...</p>
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
          <h1 className="text-2xl font-black text-foreground mb-2">Reset Password</h1>
          <p className="text-muted font-medium">
            Enter the code sent to <span className="text-foreground font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3 text-center">Verification Code</label>
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
            <p className="text-center text-xs text-muted mt-2">Code expires in 5 minutes</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

        <p className="text-center text-sm text-muted mt-6 font-medium">
          <Link href="/auth/login" className="text-primary hover:text-primary-light font-bold transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

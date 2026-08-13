'use client';

import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SkillQuestion {
  id: string;
  question: string;
  options: string[];
}

interface BankTransferDetails {
  reference: string;
  totalPence: number;
  accountName: string;
  sortCode: string;
  accountNumber: string;
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateCartQuantity, cartTotal, cartCount, clearCart } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [skillQuestion, setSkillQuestion] = useState<SkillQuestion | null>(null);
  const [skillAnswerIndex, setSkillAnswerIndex] = useState<number | null>(null);
  const [bankTransfer, setBankTransfer] = useState<BankTransferDetails | null>(null);
  const [doneClicked, setDoneClicked] = useState(false);
  const submittingRef = useRef(false);

  const fetchSkillQuestion = useCallback(async () => {
    setSkillAnswerIndex(null);
    try {
      const res = await fetch('/api/skill-question');
      const data = await res.json();
      setSkillQuestion(data);
    } catch {
      setSkillQuestion(null);
    }
  }, []);

  useEffect(() => {
    if (cartOpen && user) {
      fetchSkillQuestion();
    }
  }, [cartOpen, user, fetchSkillQuestion]);

  const handleCheckout = async () => {
    // Guards against rapid double-clicks firing two submissions before React
    // re-renders the disabled button — `checkingOut` state alone isn't fast
    // enough to catch that race, since state updates aren't synchronous.
    if (submittingRef.current) return;

    setError('');

    if (!user) {
      setCartOpen(false);
      router.push('/auth/login');
      return;
    }

    if (!skillQuestion || skillAnswerIndex === null) {
      setError('Please answer the question below to continue');
      return;
    }

    submittingRef.current = true;
    setCheckingOut(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            competitionId: item.competitionId,
            quantity: item.quantity,
          })),
          skillQuestionId: skillQuestion.id,
          skillAnswerIndex,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Checkout failed');
        fetchSkillQuestion();
        return;
      }

      if (data.bankTransfer) {
        clearCart();
        setBankTransfer(data.bankTransfer);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      fetchSkillQuestion();
    } finally {
      submittingRef.current = false;
      setCheckingOut(false);
    }
  };

  if (!cartOpen) return null;

  const handleClose = () => {
    setCartOpen(false);
    setBankTransfer(null);
    setDoneClicked(false);
    setError('');
  };

  const handleDone = () => {
    if (doneClicked) return;
    setDoneClicked(true);
    setTimeout(() => {
      handleClose();
      router.push('/account/tickets');
    }, 700);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border z-50 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-black text-foreground">
            {bankTransfer ? 'Complete Your Payment' : (
              <>Your Cart {cartCount > 0 && <span className="text-primary">({cartCount})</span>}</>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {bankTransfer ? (
            <div className="p-6 space-y-5">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-foreground">
                  Almost there! Transfer the amount below to confirm your entry.
                </p>
                <p className="text-xs text-muted font-medium mt-1">
                  We&apos;ll issue your tickets as soon as we see the payment land — usually the same day.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl divide-y divide-border/50">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted font-semibold">Amount to pay</span>
                  <span className="text-lg font-black text-foreground">{formatPrice(bankTransfer.totalPence)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted font-semibold">Account name</span>
                  <span className="text-sm font-bold text-foreground">{bankTransfer.accountName}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted font-semibold">Sort code</span>
                  <span className="text-sm font-bold text-foreground">{bankTransfer.sortCode}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted font-semibold">Account number</span>
                  <span className="text-sm font-bold text-foreground">{bankTransfer.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted font-semibold">Payment reference</span>
                  <span className="text-sm font-black text-primary">{bankTransfer.reference}</span>
                </div>
              </div>

              <div className="bg-danger/10 border border-danger/20 rounded-xl p-3">
                <p className="text-xs text-danger font-bold text-center">
                  You must include the reference &ldquo;{bankTransfer.reference}&rdquo; on your transfer, or we won&apos;t be able to match your payment.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDone}
                disabled={doneClicked}
                className="block w-full text-center py-3 bg-primary hover:bg-primary-light text-background font-black rounded-xl transition-colors disabled:opacity-70"
              >
                {doneClicked ? 'Thanks! Redirecting…' : 'Done'}
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Cart is empty</h3>
              <p className="text-muted font-medium mb-6">Browse competitions and add tickets to get started.</p>
              <Link
                href="/competitions"
                onClick={() => setCartOpen(false)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-colors"
              >
                Browse Competitions
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.competitionId} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.competitionTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
                        {item.competitionTitle}
                      </h4>
                      <p className="text-xs text-muted font-medium mt-1">
                        {formatPrice(item.ticketPrice)} per ticket
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.competitionId)}
                      className="p-1 text-muted hover:text-danger transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.competitionId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-background border border-border text-foreground text-sm font-bold flex items-center justify-center hover:border-primary/50 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-foreground w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.competitionId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-background border border-border text-foreground text-sm font-bold flex items-center justify-center hover:border-primary/50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-black text-foreground">
                      {formatPrice(item.ticketPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted font-semibold">Total</span>
              <span className="text-xl font-black text-foreground">{formatPrice(cartTotal)}</span>
            </div>
            {user && skillQuestion && (
              <div className="bg-background border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-foreground">{skillQuestion.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {skillQuestion.options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSkillAnswerIndex(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        skillAnswerIndex === index
                          ? 'bg-primary text-background glow-primary'
                          : 'bg-card border border-border text-muted hover:text-foreground hover:border-primary/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={checkingOut || (!!user && skillAnswerIndex === null)}
              className="w-full py-4 bg-primary hover:bg-primary-light text-background font-black text-lg rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 glow-primary"
            >
              {checkingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating your order...
                </span>
              ) : !user ? (
                'Log in to Checkout'
              ) : (
                `Checkout, ${formatPrice(cartTotal)}`
              )}
            </button>
            <p className="text-xs text-muted text-center font-medium">
              We&apos;re currently only accepting payment by bank transfer. You must be 18+ to enter.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

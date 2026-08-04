'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { CompetitionsDesktopMenu, CompetitionsMobileMenu } from './CompetitionsNavMenu';

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

function CartButton() {
  const { cartCount, setCartOpen } = useStore();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2.5 text-muted hover:text-foreground transition-colors"
      aria-label="Open cart"
    >
      <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-6 h-6 bg-primary text-background text-xs font-black rounded-full flex items-center justify-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}

function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 xl:gap-3">
        <Link
          href="/auth/login"
          className="px-3 xl:px-5 py-2.5 text-sm xl:text-base font-semibold text-muted hover:text-foreground transition-colors whitespace-nowrap"
        >
          Log In
        </Link>
        <Link
          href="/auth/register"
          className="px-4 xl:px-6 py-2.5 xl:py-3 text-sm xl:text-base font-bold bg-primary hover:bg-primary-light text-background rounded-xl transition-all hover:scale-105 glow-primary whitespace-nowrap"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden lg:block relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-background text-base font-black">
          {user.name[0]}
        </div>
        <span className="text-base font-semibold text-foreground max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/account/tickets"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              My Tickets
            </Link>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-white/5 transition-colors"
              >
                Admin Portal
              </Link>
            )}
            <div className="border-t border-border my-1" />
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-danger hover:bg-white/5 transition-colors"
            >
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3 xl:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link href="/" className="flex items-center gap-2 lg:gap-3 shrink-0">
            <Image src="/logo.png" alt="Clutch Competitions" width={64} height={64} className="w-12 h-12 lg:w-16 lg:h-16 object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
                Clutch<span className="text-primary">Comps</span>
              </span>
              <span className="text-xs text-muted -mt-1 hidden xl:block tracking-widest uppercase font-medium whitespace-nowrap">
                Premium Prize Competitions
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <CompetitionsDesktopMenu />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 xl:px-4 py-2.5 text-sm xl:text-base font-semibold text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CartButton />
            <UserMenu />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-muted hover:text-foreground"
              aria-label="Toggle menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out bg-surface border-t border-border ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          <CompetitionsMobileMenu onNavigate={() => setMobileOpen(false)} />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  My Account
                </Link>
                <Link
                  href="/account/tickets"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  My Tickets
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-primary hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await logout();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-semibold text-danger hover:bg-white/5 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-3 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-3 text-sm font-bold bg-primary text-background rounded-xl hover:bg-primary-light transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

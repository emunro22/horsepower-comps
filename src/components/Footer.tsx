import Link from 'next/link';
import Logo from './Logo';
import { socialLinks } from '@/lib/social';
import { FREE_ENTRY_ADDRESS } from '@/lib/free-entry';

const footerLinks = {
  Competitions: [
    { href: '/competitions', label: 'All Competitions' },
    { href: '/competitions?category=cars', label: 'Cars' },
    { href: '/competitions?category=cash', label: 'Cash Prizes' },
    { href: '/competitions?category=tech', label: 'Tech' },
    { href: '/competitions?category=holidays', label: 'Holidays' },
  ],
  Company: [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ],
  Legal: [
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/responsible-play', label: 'Responsible Play' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      {/* Payment methods bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <p className="text-sm font-semibold text-muted">Currently accepting payment by bank transfer only</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Logo size="lg" />
              <span className="text-xl font-extrabold text-foreground uppercase">
                Horse Power <span className="text-primary">Competitions</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs mb-6">
              The UK&apos;s premier prize competition platform. Win incredible prizes from cars to cash, tech to holidays.
            </p>
            <p className="text-xs text-muted max-w-xs mb-6">
              {FREE_ENTRY_ADDRESS} &middot;{' '}
              <a href="mailto:decolow@icloud.com" className="hover:text-primary transition-colors">
                decolow@icloud.com
              </a>
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-card hover:bg-card-hover border border-border flex items-center justify-center text-muted hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted font-medium">
              <span>18+ Only</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Please play responsibly</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Free postal entry available</span>
            </div>
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} Horse Power Competitions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

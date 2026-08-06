import Link from 'next/link';
import Logo from './Logo';
import { socialLinks } from '@/lib/social';

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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-semibold text-muted">Secure payments powered by Stripe</p>
            <div className="flex items-center gap-3">
              {/* Visa */}
              <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
                <svg viewBox="0 0 48 32" className="h-5 w-auto">
                  <rect width="48" height="32" rx="4" fill="#fff"/>
                  <path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm12.3-11.2c-.6-.2-1.5-.5-2.7-.5-3 0-5 1.5-5 3.7 0 1.6 1.5 2.5 2.6 3 1.1.6 1.5 1 1.5 1.5 0 .8-1 1.2-1.8 1.2-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.2-2.5-3-.7-.5-1.6-1-1.6-1.5 0-.5.5-1 1.6-1 .9 0 1.6.2 2.1.4l.3.1.4-2.4zM36 21l.5-1.4h3.6l.3 1.4H43L40.6 9.5h-2.3c-.7 0-1.3.4-1.5 1L33 21h3.1zm3.5-3.7l1.5-4 .4-1.1.2 1 .9 4.1h-3zM16 9.5L13 17l-.3-1.6c-.6-1.8-2.3-3.8-4.2-4.8l2.7 10.3H14L19 9.5h-3z" fill="#1A1F71"/>
                  <path d="M10.5 9.5H5.6l-.1.3c3.8 1 6.4 3.3 7.4 6.1l-1.1-5.3c-.2-.8-.7-1-1.3-1.1z" fill="#F9A533"/>
                </svg>
              </div>
              {/* Mastercard */}
              <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
                <svg viewBox="0 0 48 32" className="h-5 w-auto">
                  <rect width="48" height="32" rx="4" fill="#fff"/>
                  <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                  <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                  <path d="M24 10a8 8 0 0 0-3 6 8 8 0 0 0 3 6 8 8 0 0 0 3-6 8 8 0 0 0-3-6z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* Amex */}
              <div className="h-8 w-12 bg-[#006FCF] rounded-md flex items-center justify-center">
                <span className="text-[9px] font-black text-white tracking-tight leading-none">AMEX</span>
              </div>
              {/* Apple Pay */}
              <div className="h-8 w-12 bg-black rounded-md flex items-center justify-center">
                <svg viewBox="0 0 48 24" className="h-4 w-auto">
                  <path d="M11.2 4.5c-.7.8-1.8 1.4-2.9 1.3-.1-1.1.4-2.3 1.1-3 .7-.8 1.9-1.4 2.8-1.4.1 1.2-.4 2.3-1 3.1zm1 1.5c-1.6-.1-3 .9-3.8.9s-2-.9-3.2-.8C3.5 6.2 2 7.2 1.1 8.7c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2-.1 1.7-.8 3.1-.8s1.9.8 3.2.7c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.8 0-2.4 2-3.5 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9l.3.4z" fill="#fff"/>
                  <text x="20" y="17" fill="#fff" fontSize="10" fontFamily="system-ui" fontWeight="600">Pay</text>
                </svg>
              </div>
              {/* Google Pay */}
              <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center border border-gray-200">
                <span className="text-[8px] font-bold text-gray-700 tracking-tight leading-none">GPay</span>
              </div>
            </div>
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
                Horsepower<span className="text-primary">Comps</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs mb-6">
              The UK&apos;s premier prize competition platform. Win incredible prizes from cars to cash, tech to holidays.
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
              &copy; {new Date().getFullYear()} Horsepowercomps Ltd. All rights reserved. Registered in the UK.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

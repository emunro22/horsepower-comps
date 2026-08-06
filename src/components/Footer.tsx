import Link from 'next/link';
import Image from 'next/image';

// TODO: replace href "#" with the real profile URLs once available.
const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.847v1.202h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
  {
    label: 'TikTok',
    href: '#',
    path: 'M16.6 5.82c-.7-.76-1.13-1.75-1.21-2.82h-3.02v14.28c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1 0-5.44c.28 0 .55.04.8.12V11.5a5.8 5.8 0 0 0-.8-.06c-3.2 0-5.8 2.6-5.8 5.8s2.6 5.8 5.8 5.8 5.8-2.6 5.8-5.8V9.4a8.9 8.9 0 0 0 5.14 1.64V8.02a5.83 5.83 0 0 1-3.99-2.2z',
  },
  {
    label: 'YouTube',
    href: '#',
    path: 'M23.499 6.203a3.007 3.007 0 0 0-2.113-2.129C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.529A3.007 3.007 0 0 0 .501 6.203C0 8.093 0 12 0 12s0 3.907.501 5.797a3.007 3.007 0 0 0 2.113 2.129c1.881.529 9.386.529 9.386.529s7.505 0 9.386-.529a3.007 3.007 0 0 0 2.113-2.129C24 15.907 24 12 24 12s0-3.907-.501-5.797ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z',
  },
];

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
              <Image src="/logo.png" alt="Clutch Competitions" width={72} height={72} className="w-18 h-18 object-contain shrink-0" />
              <span className="text-xl font-extrabold text-foreground">
                Clutch <span className="text-primary">Competitions</span>
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
              &copy; {new Date().getFullYear()} Clutch Competitions Ltd. All rights reserved. Registered in the UK.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import { Barlow, Oswald } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Horsepowercomps, Win Premium Prizes',
    template: '%s | Horsepowercomps',
  },
  description:
    'Win incredible prizes from dream cars to life-changing cash. The UK\'s most trusted competition platform with verified draws and real winners. Tickets from just £1.',
  keywords: [
    'competitions UK',
    'win prizes UK',
    'prize competitions',
    'prize draws UK',
    'win a car UK',
    'cash prizes UK',
    'online competitions UK',
    'Horsepowercomps',
  ],
  openGraph: {
    title: 'Horsepowercomps, Win Premium Prizes',
    description: 'Win incredible prizes from dream cars to life-changing cash. Tickets from just £1.',
    siteName: 'Horsepowercomps',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import Link from 'next/link';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Who We Are',
    body: (
      <p>
        Horsepowercomps is the data controller for the personal information you provide when
        you use horsepowercomps.co.uk (the &quot;Site&quot;). This policy explains what data we
        collect, why, and how we look after it, in line with UK GDPR and the Data Protection Act
        2018.
      </p>
    ),
  },
  {
    title: '2. Information We Collect',
    body: (
      <ul className="list-disc list-inside space-y-1.5">
        <li>Account details: name, email address, phone number, date of birth, postal address.</li>
        <li>Order information: competitions entered, ticket numbers, order history.</li>
        <li>Payment information: bank transfer details you use to pay us &mdash; we never see or store your full card details.</li>
        <li>Free postal entries: the details you send us on a postcard, used only for that competition entry.</li>
        <li>Technical information: IP address, browser type, and pages visited, used for security and analytics.</li>
      </ul>
    ),
  },
  {
    title: '3. How We Use Your Information',
    body: (
      <ul className="list-disc list-inside space-y-1.5">
        <li>To process your ticket purchases and enter you into the relevant draw.</li>
        <li>To contact you about your account, orders, or if you win a prize.</li>
        <li>To send you marketing communications about new competitions, where you have opted in (you can unsubscribe at any time).</li>
        <li>To meet our legal and regulatory obligations, including age verification and fraud prevention.</li>
        <li>To improve the Site and diagnose technical issues.</li>
      </ul>
    ),
  },
  {
    title: '4. Who We Share Data With',
    body: (
      <p>
        We share the minimum data necessary with trusted third parties who help us run the Site:
        Resend (transactional email delivery) and Vercel Blob
        (secure storage for competition images). We do not sell your personal data to anyone.
      </p>
    ),
  },
  {
    title: '5. How Long We Keep Your Data',
    body: (
      <p>
        We retain account and order data for as long as your account is active and for a
        reasonable period afterwards to meet our accounting, tax, and legal obligations. Free
        postal entry details are retained only for the duration of the competition entered and a
        short period afterwards for verification purposes.
      </p>
    ),
  },
  {
    title: '6. Your Rights',
    body: (
      <p>
        Under UK GDPR you have the right to access, correct, or delete your personal data, to
        restrict or object to certain processing, and to request a copy of your data in a
        portable format. To exercise any of these rights, contact us via our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page. You also have the right to lodge a complaint with the Information Commissioner&apos;s
        Office (ICO) at ico.org.uk.
      </p>
    ),
  },
  {
    title: '7. Cookies',
    body: (
      <p>
        The Site uses cookies for essential functionality (such as keeping you signed in and
        remembering your cart) and for bot/fraud protection. See our{' '}
        <Link href="/cookies" className="text-primary hover:text-primary-light font-semibold">
          Cookie Policy
        </Link>{' '}
        for full details.
      </p>
    ),
  },
  {
    title: '8. Security',
    body: (
      <p>
        We use industry-standard security measures, including encrypted connections (SSL/TLS) and
        secure password hashing, to protect your data. Payment card details are never stored on
        our servers.
      </p>
    ),
  },
  {
    title: '9. Changes to This Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted text-lg font-medium">
          How we collect, use, and protect your personal information.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-foreground mb-3">{section.title}</h2>
            <div className="text-sm text-muted leading-relaxed font-medium">{section.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

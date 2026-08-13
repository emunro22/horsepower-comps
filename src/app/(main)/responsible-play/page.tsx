import Link from 'next/link';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Play Responsibly',
    body: (
      <p>
        Horse Power Competitions is intended to be a fun way to enter for the chance to win great
        prizes. Our competitions require entrants to answer a skill-testing question, so they are
        not games of pure chance, but we still want everyone who takes part to do so responsibly
        and within their means.
      </p>
    ),
  },
  {
    title: '2. 18+ Only',
    body: (
      <p>
        You must be 18 or over to purchase tickets on this Site. We may ask you to verify your
        age and identity before releasing a prize, and reserve the right to void any entry made
        by someone under 18.
      </p>
    ),
  },
  {
    title: '3. Only Spend What You Can Afford',
    body: (
      <ul className="list-disc list-inside space-y-1.5">
        <li>Set yourself a budget before entering, and stick to it.</li>
        <li>Never enter competitions using money you need for essentials.</li>
        <li>Take regular breaks and avoid entering competitions to chase previous spending.</li>
        <li>Remember tickets are non-refundable, so only buy what you&apos;re comfortable with &mdash; see our <Link href="/terms" className="text-primary hover:text-primary-light font-semibold">Terms &amp; Conditions</Link>.</li>
      </ul>
    ),
  },
  {
    title: '4. Take a Break or Self-Exclude',
    body: (
      <p>
        If you feel you need a break, you can ask us to temporarily suspend your account at any
        time by contacting us via our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page. We will action self-exclusion requests promptly and will not market to you during
        the exclusion period.
      </p>
    ),
  },
  {
    title: '5. Support &amp; Advice',
    body: (
      <p>
        If you feel your spending on competitions, or gambling more generally, is becoming a
        problem, free and confidential support is available from GamCare (gamcare.org.uk, 0808 8020 133)
        and BeGambleAware (begambleaware.org). These organisations can provide advice and support
        whether or not the activity in question is classed as gambling.
      </p>
    ),
  },
  {
    title: '6. Free Entry Route',
    body: (
      <p>
        Remember that every competition can also be entered for free by post, with no purchase
        necessary, as described in Section 3 of our{' '}
        <Link href="/terms" className="text-primary hover:text-primary-light font-semibold">
          Terms &amp; Conditions
        </Link>
        .
      </p>
    ),
  },
];

export default function ResponsiblePlayPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Responsible Play
        </h1>
        <p className="text-muted text-lg font-medium">
          Our commitment to keeping competition entry fun, fair, and within your means.
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

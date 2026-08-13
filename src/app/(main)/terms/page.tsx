import Link from 'next/link';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. About Us',
    body: (
      <p>
        Horsepowercomps (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a UK-registered
        company operating prize competitions at horsepowercomps.co.uk (the
        &quot;Site&quot;). These Terms &amp; Conditions govern every competition run on the Site.
        By purchasing an entry, or by submitting a free postal entry, you agree to be bound by
        these terms.
      </p>
    ),
  },
  {
    title: '2. Eligibility',
    body: (
      <p>
        Entrants must be aged 18 or over and resident in the United Kingdom. Employees of Horsepowercomps
        Competitions, their immediate families, and anyone professionally connected to the
        running of a competition are not eligible to enter that competition. We reserve the right
        to request proof of age and identity before releasing any prize.
      </p>
    ),
  },
  {
    title: '3. How to Enter',
    body: (
      <p>
        Entries can be made by purchasing one or more numbered tickets via the Site for the
        ticket price shown against each competition, subject to the maximum tickets per person
        stated on the competition page. In accordance with UK law on prize competitions, a free
        postal entry route is also available for every competition &mdash; write your name,
        address, email, date of birth, and the name of the competition you wish to enter on a
        postcard, and post it to the address shown on our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page. One postal entry per envelope. Postal entries receive one ticket, entered into the
        same draw as paid tickets, and carry no lesser chance of winning.
      </p>
    ),
  },
  {
    title: '4. Payment',
    body: (
      <p>
        Prices are shown in GBP and include any applicable taxes. Your entry is only confirmed
        once payment has been successfully verified and your tickets have been allocated.
      </p>
    ),
  },
  {
    title: '5. No Refunds',
    body: (
      <p>
        <span className="font-bold text-foreground">
          All ticket purchases are final and non-refundable.
        </span>{' '}
        Because every ticket is immediately allocated a unique number and entered into the draw,
        we are unable to offer refunds, exchanges, or cancellations once an order has been
        completed, except where required by law (for example, where a competition is cancelled
        by us before the draw takes place). Please choose your ticket quantity carefully before
        completing checkout.
      </p>
    ),
  },
  {
    title: '6. Minimum Ticket Threshold &amp; Draw Guarantee',
    body: (
      <p>
        Every competition has a minimum ticket sales threshold, shown as a percentage on the
        competition page (typically 85%). If that threshold has not been reached by the
        advertised draw date, the competition is not cancelled and no refunds are issued &mdash;
        instead, the competition will automatically continue and remain open for ticket sales
        until the threshold is met, however long that takes, at which point the draw will take
        place. This guarantees that every competition we run will always produce a winner.
      </p>
    ),
  },
  {
    title: '7. The Draw &amp; Winner Selection',
    body: (
      <p>
        Once a competition&apos;s threshold has been met and its draw date has passed, the
        winning ticket is selected using a cryptographically secure random number generator, so
        that every issued ticket (whether purchased or received via free postal entry) has an
        equal chance of winning. Winners are notified by email and/or phone using the details
        provided at entry, and are also announced on the Site and our social media channels.
      </p>
    ),
  },
  {
    title: '8. Prizes &amp; Cash Alternatives',
    body: (
      <p>
        Where a cash alternative is advertised alongside a physical prize, the winner may choose
        either option and has 7 days from being notified to make their decision, after which the
        cash alternative will be paid automatically. Cash prizes are transferred by bank transfer
        within 48 hours of the draw or the winner&apos;s decision. Physical prizes are delivered
        free of charge to a UK mainland address within 14 working days; holiday prizes are
        booked in consultation with the winner, subject to availability.
      </p>
    ),
  },
  {
    title: '9. Instant Win Prizes',
    body: (
      <p>
        Some competitions include Instant Win prizes tied to specific, pre-determined ticket
        numbers. An Instant Win is only confirmed and paid out once the ticket carrying that
        number has been issued and the competition&apos;s ticket revenue has reached the
        activation threshold shown for that prize. Instant Win prizes are paid or delivered using
        the same timelines set out in Section 8.
      </p>
    ),
  },
  {
    title: '10. Our Right to Amend or Cancel',
    body: (
      <p>
        We reserve the right to amend these terms, correct pricing or descriptive errors, or
        withdraw a competition prior to its draw date in exceptional circumstances (for example,
        prize unavailability or suspected fraud). Where we cancel a competition prior to its
        draw, entrants will be offered a full refund of that competition&apos;s ticket purchases.
      </p>
    ),
  },
  {
    title: '11. Limitation of Liability',
    body: (
      <p>
        Save for death or personal injury caused by our negligence, or any other liability which
        cannot be excluded by law, our liability to you in connection with any competition is
        limited to the value of tickets you purchased for that competition.
      </p>
    ),
  },
  {
    title: '12. Complaints',
    body: (
      <p>
        If you have a complaint about the running of a competition, please contact us via our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page and we will investigate and respond within 14 days.
      </p>
    ),
  },
  {
    title: '13. Governing Law',
    body: (
      <p>
        These terms are governed by the laws of England and Wales, and the courts of England and
        Wales shall have exclusive jurisdiction over any dispute arising from them.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-muted text-lg font-medium">
          Please read these terms carefully before entering any of our competitions.
        </p>
      </div>

      <div className="animate-fade-in-up bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex items-start gap-3">
        <div className="text-xl mt-0.5">🛡️</div>
        <p className="text-sm text-foreground font-medium leading-relaxed">
          In short: <span className="font-bold">all sales are final (no refunds)</span>, and{' '}
          <span className="font-bold">every competition runs until its minimum ticket threshold
          is met</span> &mdash; it will never be cancelled for low sales, only extended, so a
          winner is always guaranteed.
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

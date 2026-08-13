import Link from 'next/link';
import { FREE_ENTRY_ADDRESS } from '@/lib/free-entry';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. About Us',
    body: (
      <p>
        Horse Power Competitions (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a
        Glasgow-based business operating prize competitions at horsepowercomps.co.uk (the
        &quot;Site&quot;). We trade as Horse Power Competitions from{' '}
        <span className="font-bold text-foreground">{FREE_ENTRY_ADDRESS}</span>, and you can
        contact us by email at hello@horsepowercomps.co.uk or via our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page. These Terms &amp; Conditions govern every competition run on the Site. By
        purchasing an entry, or by submitting a free postal entry, you agree to be bound by these
        terms.
      </p>
    ),
  },
  {
    title: '2. Eligibility',
    body: (
      <p>
        Entrants must be aged 18 or over and resident in the United Kingdom. Employees of Horse
        Power Competitions, their immediate families, and anyone professionally connected to the
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
        postcard, and post it to:
        <br />
        <span className="font-bold text-foreground">{FREE_ENTRY_ADDRESS}</span>
        <br />
        One postal entry per envelope. Postal entries must arrive by the competition&apos;s draw
        date shown on its page, receive one ticket, are entered into the same draw as paid
        tickets, and carry no lesser chance of winning. See our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page for full details.
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
    title: '5. Refunds',
    body: (
      <p>
        Once a ticket has been allocated a unique number and entered into the draw, we are
        unable to offer refunds, exchanges, or cancellations, except: (a) where we cancel a
        competition prior to its draw under Section 9; or (b) where you are otherwise entitled
        to a refund under the Consumer Contracts (Information, Cancellation and Additional
        Charges) Regulations 2013 or other applicable consumer law. A competition that runs past
        its advertised draw date under the automatic extension described in Section 6 is not a
        cancellation and does not itself entitle you to a refund.
        Entry into a prize competition is a service that begins as soon as your ticket is
        allocated and entered into the draw, so by completing checkout you acknowledge that
        performance begins immediately and that the standard 14-day cancellation right does not
        apply once your ticket has been issued. Please choose your ticket quantity carefully
        before completing checkout.
      </p>
    ),
  },
  {
    title: '6. Draw Guarantee',
    body: (
      <p>
        Every competition must sell out before it is drawn. If a competition has not sold out by
        its advertised draw date, it automatically continues and remains open for ticket sales
        for a further 30 days. If it still has not sold out by then, it is automatically extended
        for another 30 days, and this repeats for as long as it takes to sell out &mdash; this
        extension is automatic and is never left to our discretion. Once a competition sells out,
        our team runs the draw, often live on our social media channels. A sold-out competition
        is never cancelled and never replaced with a refund in place of a draw.
      </p>
    ),
  },
  {
    title: '7. The Draw &amp; Winner Selection',
    body: (
      <p>
        Once a competition has sold out under Section 6, the winning ticket is selected using a
        cryptographically secure random number generator, so
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
        free of charge to a UK mainland address within 14 working days. Holiday and experience
        prizes (including travel, accommodation, and treatments arranged on the winner&apos;s
        behalf) are booked in consultation with the winner, subject to availability, through
        reputable, appropriately licensed and insured providers. Where a prize involves travel
        outside the UK, or any medical, cosmetic, or other treatment carried out by a third-party
        provider, our responsibility is limited to arranging and paying for that prize as
        advertised; the provider&apos;s own terms and any applicable travel or medical insurance
        govern the service itself, and winners are strongly advised to take out independent
        travel insurance before travelling. A cash alternative equal to the advertised prize
        value is available on request for any prize, including where a prize cannot reasonably
        be provided as advertised.
      </p>
    ),
  },
  {
    title: '9. Our Right to Amend or Cancel',
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
    title: '10. Limitation of Liability',
    body: (
      <p>
        Save for death or personal injury caused by our negligence, fraud or fraudulent
        misrepresentation, or any other liability which cannot be excluded or limited by law, our
        liability to you in connection with any competition is limited to the greater of (a) the
        advertised value of the prize for that competition, and (b) the total amount you paid for
        tickets in that competition. We do not exclude or limit our liability for failing to
        deliver, or pay the cash alternative for, a prize you have validly won.
      </p>
    ),
  },
  {
    title: '11. Complaints',
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
    title: '12. Governing Law',
    body: (
      <p>
        We are based in Glasgow, and these terms are governed by the laws of Scotland. Any
        dispute arising from them may be brought in the Scottish courts. As a consumer, you may
        also bring proceedings in the courts of the part of the United Kingdom in which you live,
        and nothing in this clause affects your statutory rights.
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
          In short: every competition must <span className="font-bold">sell out before it&apos;s
          drawn</span>. If it hasn&apos;t sold out by the draw date, it&apos;s
          <span className="font-bold"> automatically extended by 30 days, repeating for as long
          as it takes</span> &mdash; never cancelled, and never replaced with a refund. Once it
          sells out, our team runs the draw.
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

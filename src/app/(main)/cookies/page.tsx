import Link from 'next/link';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. What Are Cookies?',
    body: (
      <p>
        Cookies are small text files placed on your device when you visit a website. They help
        the site remember information about your visit, which can make it easier to use and more
        secure.
      </p>
    ),
  },
  {
    title: '2. Cookies We Use',
    body: (
      <ul className="list-disc list-inside space-y-1.5">
        <li>
          <span className="font-bold text-foreground">Essential cookies:</span> keep you signed
          in, remember the contents of your cart, and are required for the Site to function.
          These cannot be switched off.
        </li>
        <li>
          <span className="font-bold text-foreground">Analytics:</span> we use Vercel Web
          Analytics to understand how the Site is used. It does not use cookies or store any
          personal identifiers, so no separate consent is needed for it.
        </li>
      </ul>
    ),
  },
  {
    title: '3. Controlling Cookies',
    body: (
      <p>
        Most web browsers let you control cookies through their settings, including blocking or
        deleting them. Please note that blocking essential cookies will prevent parts of the Site,
        such as checkout, from working correctly.
      </p>
    ),
  },
  {
    title: '4. More Information',
    body: (
      <p>
        For details on how we handle personal data more generally, see our{' '}
        <Link href="/privacy" className="text-primary hover:text-primary-light font-semibold">
          Privacy Policy
        </Link>
        . If you have any questions about our use of cookies, get in touch via our{' '}
        <Link href="/contact" className="text-primary hover:text-primary-light font-semibold">
          Contact
        </Link>{' '}
        page.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Cookie Policy
        </h1>
        <p className="text-muted text-lg font-medium">
          What cookies we use on this Site, and why.
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

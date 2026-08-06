import FadeIn from './FadeIn';

const steps = [
  {
    number: '01',
    title: 'Pick a Competition',
    description: 'Browse our range of incredible prizes and find the competition that catches your eye.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get Your Tickets',
    description: 'Choose how many tickets you want and complete your purchase securely online.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Wait for the Draw',
    description: 'Once the ticket threshold is met, a winner is selected using a verified random number generator.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Claim Your Prize',
    description: 'Winners are contacted directly. Cash within 48 hours, physical prizes delivered to your door.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Winning is simple. Four easy steps and you could be our next big winner.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeIn
              key={step.number}
              delay={i * 100}
              className="relative bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors group"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background text-sm font-black px-3 py-1 rounded-lg">
                {step.number}
              </div>
              <div className="w-16 h-16 mx-auto mt-4 mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

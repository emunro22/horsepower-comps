import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { FREE_ENTRY_ADDRESS, FREE_ENTRY_INSTRUCTIONS } from '@/lib/free-entry';

const steps = [
  { number: '01', title: 'Create Your Account', description: 'Sign up for free in under 30 seconds. All you need is your name, email, and to confirm you\'re 18+. No credit card required to create an account.', icon: '👤' },
  { number: '02', title: 'Browse Competitions', description: 'Explore our range of incredible prizes, from dream cars and luxury holidays to cash prizes and the latest tech. Filter by category, price, or ending soonest.', icon: '🔍' },
  { number: '03', title: 'Choose Your Tickets, or Enter Free', description: `Select how many tickets you want, each ticket is one entry into the draw. Prefer not to pay? Every competition also has a free postal entry route with an equal chance of winning: ${FREE_ENTRY_INSTRUCTIONS} Post to: ${FREE_ENTRY_ADDRESS}.`, icon: '🎫' },
  { number: '04', title: 'Secure Checkout', description: 'Complete your order securely at checkout. Your payment and personal details are handled with care and never stored insecurely on our servers.', icon: '🔒' },
  { number: '05', title: 'Winner is Drawn', description: 'Once the ticket threshold is met, a winner is selected using a cryptographically secure random number generator. The winning ticket number is published for full transparency.', icon: '🎲' },
  { number: '06', title: 'Claim Your Prize!', description: 'Winners are contacted directly by our team. Cash prizes are transferred within 48 hours. Physical prizes are delivered to your door within 14 working days. Where a cash alternative is offered, you choose!', icon: '🏆' },
];

const trustPoints = [
  { title: 'Provably Fair', description: 'Every draw uses a cryptographically secure random number generator. Results are published with verification hashes so anyone can independently verify fairness.', icon: '🎲' },
  { title: 'UK Based', description: 'Horse Power Competitions operates fully within UK competition law. We take compliance seriously so you can enter with confidence.', icon: '📋' },
  { title: 'Real Winners', description: 'We publish all our winners with their permission. Check out our Winners page to see real people who\'ve won real prizes.', icon: '✅' },
  { title: 'Secure Payments', description: 'All payments are handled securely at checkout. Your card details never touch our servers.', icon: '🔐' },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          How It Works
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          Entering our competitions is simple, secure, and transparent. Here&apos;s everything you need to know.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 mb-20">
        {steps.map((step, i) => (
          <FadeIn key={step.number} className="flex gap-6 items-start">
            <div className="shrink-0 w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center text-3xl">
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Step {step.number}
                </span>
                <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
              </div>
              <p className="text-muted leading-relaxed font-medium">{step.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="text-center mb-12">
        <h2 className="text-3xl font-black text-foreground mb-4">Why Trust Horse Power Competitions?</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          We&apos;re committed to running the fairest, most transparent competitions in the UK.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {trustPoints.map((point, i) => (
          <FadeIn key={point.title} delay={i * 100} className="bg-card border border-border rounded-2xl p-6">
            <div className="text-3xl mb-3">{point.icon}</div>
            <h3 className="text-lg font-bold text-foreground mb-2">{point.title}</h3>
            <p className="text-sm text-muted leading-relaxed font-medium">{point.description}</p>
          </FadeIn>
        ))}
      </div>

      {/* Threshold Explanation */}
      <FadeIn className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-16 text-center">
        <div className="text-3xl mb-3">🛡️</div>
        <h2 className="text-xl font-black text-foreground mb-3">Draw Guarantee</h2>
        <p className="text-sm text-muted max-w-lg mx-auto font-medium leading-relaxed">
          Every competition has a minimum ticket threshold (typically 85%). If the threshold isn&apos;t met by the draw date,
          the competition is automatically extended, up to a maximum of 30 days, giving it the best chance of reaching its goal.
          The threshold and countdown are clearly displayed on each competition page so you always know where things stand.
        </p>
      </FadeIn>

      <FadeIn className="text-center bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-10">
        <h2 className="text-2xl font-black text-foreground mb-3">Ready to Get Started?</h2>
        <p className="text-muted mb-6 max-w-md mx-auto font-medium">
          Create your free account and start entering today. Your next big win could be just one ticket away!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/competitions"
            className="px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
          >
            Browse Competitions
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-card border border-border hover:border-primary/50 text-foreground font-bold rounded-xl transition-all hover:scale-105"
          >
            Create Account
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

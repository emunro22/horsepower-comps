import HeroSection from '@/components/HeroSection';
import CompetitionsCarousel from '@/components/CompetitionsCarousel';
import CompetitionGrid from '@/components/CompetitionGrid';
import HowItWorksSection from '@/components/HowItWorksSection';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

// Keep the live competition count fresh without forcing full dynamic
// rendering on every request.
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompetitionsCarousel />

      {/* Featured Competitions */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
                Featured Competitions
              </h2>
              <p className="text-muted text-lg font-medium">
                Our biggest and best prizes, don&apos;t miss out!
              </p>
            </div>
            <Link
              href="/competitions"
              className="hidden sm:inline-flex items-center gap-1 text-primary hover:text-primary-light font-bold text-sm transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </FadeIn>

          <CompetitionGrid filter="featured" />
        </div>
      </section>

      {/* Live Competitions Grid */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
              Live Competitions
            </h2>
            <p className="text-muted text-lg font-medium">
              Browse all our currently live competitions and find your next win.
            </p>
          </FadeIn>

          <CompetitionGrid filter="live" limit={10} />

          <div className="text-center mt-6">
            <Link
              href="/competitions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
            >
              See All Competitions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-5 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted checkout' },
              { icon: '🎲', title: 'Provably Fair', desc: 'Verified random draws' },
              { icon: '🚚', title: 'Free Delivery', desc: 'All prizes delivered free' },
              { icon: '🇬🇧', title: 'UK Based', desc: 'Operated from the UK' },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-center gap-3">
                <div className="text-2xl">{item.icon}</div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{item.title}</h3>
                  <p className="text-[10px] text-muted font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-8 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
              Ready to Win?
            </h2>
            <p className="text-muted text-sm sm:text-base mb-5 max-w-xl mx-auto font-medium">
              Sign up today and get access to all our live competitions.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl text-base transition-all hover:scale-105 glow-primary"
            >
              Create Free Account
            </Link>
          </FadeIn>
        </div>
      </section>

      <HowItWorksSection />

      {/* Draw Guarantee Banner */}
      <section className="py-8 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-black text-foreground mb-2">Draw Guarantee</h3>
            <p className="text-sm text-muted max-w-lg mx-auto font-medium leading-relaxed">
              Every competition must sell out before it&apos;s drawn. If it hasn&apos;t sold out by the draw date, it
              automatically extends by 30 days, repeating for as long as it takes &mdash; never cancelled, and never
              replaced with a refund. Once it sells out, our team runs the draw.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import { db } from '@/lib/db';
import { instantWins, competitions } from '@/lib/db/schema';
import { eq, and, isNull, sql, desc } from 'drizzle-orm';

async function getQuickWinsData() {
  try {
    const rows = await db
      .select({
        prizeName: instantWins.prizeName,
        competitionTitle: competitions.title,
        competitionSlug: competitions.slug,
      })
      .from(instantWins)
      .innerJoin(competitions, eq(instantWins.competitionId, competitions.id))
      .where(and(isNull(instantWins.claimedAt), eq(competitions.status, 'live')))
      .orderBy(desc(instantWins.prizeValue))
      .limit(3);

    const [totals] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(instantWins)
      .innerJoin(competitions, eq(instantWins.competitionId, competitions.id))
      .where(and(isNull(instantWins.claimedAt), eq(competitions.status, 'live')));

    return { prizes: rows, count: totals?.count ?? 0 };
  } catch (error) {
    console.error('Quick wins fetch error:', error);
    return { prizes: [], count: 0 };
  }
}

export default async function InstantWinsSection() {
  const { prizes, count } = await getQuickWinsData();

  if (count === 0) return null;

  return (
    <section className="py-8 lg:py-12 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary font-bold text-sm">⚡ Quick Wins</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Some Prizes Are Won Instantly
          </h2>
          <p className="text-muted text-lg font-medium max-w-2xl mx-auto">
            Certain tickets are pre-designated instant winners. Buy one, and if it&apos;s a match you find out immediately, no draw, no waiting.
            Right now there {count === 1 ? 'is' : 'are'}{' '}
            <span className="text-primary font-bold">{count} instant prize{count === 1 ? '' : 's'}</span>{' '}
            still up for grabs.
          </p>
        </div>

        {prizes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            {prizes.map((p, i) => (
              <Link
                key={`${p.competitionSlug}-${i}`}
                href={`/competitions/${p.competitionSlug}`}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-5 text-center transition-all hover:scale-105"
              >
                <p className="text-2xl mb-2">🎁</p>
                <p className="font-bold text-foreground text-sm mb-1">{p.prizeName}</p>
                <p className="text-xs text-muted font-medium">{p.competitionTitle}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
          >
            Find an Instant Win
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

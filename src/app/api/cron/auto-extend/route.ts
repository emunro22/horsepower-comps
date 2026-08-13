import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, and, lt } from 'drizzle-orm';

const MAX_EXTENSION_DAYS = 30;

// Vercel Cron runs this daily. If a live competition's draw date has passed
// but it hasn't reached its minimum sold percentage, extend by 7 days — up
// to a maximum of 30 days past the competition's original draw date. Once
// that cap is hit, it stops auto-extending and is left for an admin to
// resolve manually (draw on tickets sold, or refund) in /admin/draws,
// rather than holding customer money indefinitely.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const liveComps = await db
      .select()
      .from(competitions)
      .where(
        and(
          eq(competitions.status, 'live'),
          lt(competitions.drawDate, now)
        )
      );

    let extended = 0;
    let capped = 0;

    for (const comp of liveComps) {
      const soldPercent = Math.round((comp.ticketsSold / comp.totalTickets) * 100);

      if (soldPercent < comp.minimumSoldPercentage) {
        const baseDate = comp.originalDrawDate ?? comp.drawDate;
        const capDate = new Date(baseDate.getTime() + MAX_EXTENSION_DAYS * 24 * 60 * 60 * 1000);

        if (now >= capDate) {
          capped++;
          console.log(
            `"${comp.title}" hit its ${MAX_EXTENSION_DAYS}-day extension limit at ${soldPercent}% sold — needs manual admin decision.`
          );
          continue;
        }

        const proposedDrawDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const newDrawDate = proposedDrawDate > capDate ? capDate : proposedDrawDate;

        await db
          .update(competitions)
          .set({
            drawDate: newDrawDate,
            updatedAt: now,
          })
          .where(eq(competitions.id, comp.id));

        extended++;
        console.log(
          `Extended "${comp.title}", ${soldPercent}% sold (needs ${comp.minimumSoldPercentage}%). New draw date: ${newDrawDate.toISOString()}`
        );
      }
    }

    return Response.json({
      checked: liveComps.length,
      extended,
      capped,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Auto-extend cron error:', error);
    return Response.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

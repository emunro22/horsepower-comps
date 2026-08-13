import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, and, lt } from 'drizzle-orm';

const EXTENSION_DAYS = 30;

// Vercel Cron runs this daily. Every competition must sell out before it can
// be drawn - drawing itself is always a manual, admin-triggered action (the
// team runs it themselves, often live on social media), never automatic. If
// a live competition's draw date has passed and it hasn't sold out (a fully
// sold competition would already have flipped to 'sold_out' status), it's
// extended by another 30 days from now - repeating indefinitely, for as many
// 30-day cycles as it takes - so a competition is never cancelled or drawn
// on unsold tickets.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const dueComps = await db
      .select()
      .from(competitions)
      .where(
        and(
          eq(competitions.status, 'live'),
          lt(competitions.drawDate, now)
        )
      );

    const newDrawDate = new Date(now.getTime() + EXTENSION_DAYS * 24 * 60 * 60 * 1000);

    for (const comp of dueComps) {
      await db
        .update(competitions)
        .set({ drawDate: newDrawDate, updatedAt: now })
        .where(eq(competitions.id, comp.id));

      console.log(
        `Extended "${comp.title}" another ${EXTENSION_DAYS} days (not yet sold out). New draw date: ${newDrawDate.toISOString()}`
      );
    }

    return Response.json({
      checked: dueComps.length,
      extended: dueComps.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Auto-extend cron error:', error);
    return Response.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

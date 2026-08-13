import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, and, lt, or } from 'drizzle-orm';
import { runDraw } from '@/lib/draws';
import { sendDrawWinnerNotification } from '@/lib/email';

const EXTENSION_DAYS = 30;

// Vercel Cron runs this daily. Every competition must sell out before it can
// be drawn. If a competition's draw date has passed and it hasn't sold out,
// it's extended by another 30 days from now - repeating indefinitely, for
// as many 30-day cycles as it takes - so a competition is never cancelled or
// drawn on unsold tickets. Once it does sell out, it draws automatically.
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
          or(eq(competitions.status, 'live'), eq(competitions.status, 'sold_out')),
          lt(competitions.drawDate, now)
        )
      );

    let extended = 0;
    let drawn = 0;
    let drawFailed = 0;

    for (const comp of dueComps) {
      const soldOut = comp.ticketsSold >= comp.totalTickets;

      if (soldOut) {
        const result = await runDraw(comp.id);
        if ('error' in result) {
          drawFailed++;
          console.error(`Auto-draw failed for "${comp.title}": ${result.error}`);
          continue;
        }

        drawn++;
        console.log(`Auto-drew "${comp.title}" (sold out). Winning ticket #${result.ticketNumber}.`);

        try {
          await sendDrawWinnerNotification({
            customerName: result.winnerName,
            customerEmail: result.winnerEmail,
            competitionTitle: result.competition,
            ticketNumber: result.ticketNumber,
          });
        } catch (emailError) {
          console.error(`Failed to send auto-draw winner notification for "${comp.title}":`, emailError);
        }
        continue;
      }

      const newDrawDate = new Date(now.getTime() + EXTENSION_DAYS * 24 * 60 * 60 * 1000);
      await db
        .update(competitions)
        .set({ drawDate: newDrawDate, updatedAt: now })
        .where(eq(competitions.id, comp.id));

      extended++;
      console.log(
        `Extended "${comp.title}" another ${EXTENSION_DAYS} days (not yet sold out). New draw date: ${newDrawDate.toISOString()}`
      );
    }

    return Response.json({
      checked: dueComps.length,
      extended,
      drawn,
      drawFailed,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Auto-extend cron error:', error);
    return Response.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

import { randomInt } from 'crypto';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions, tickets, users, winners, orders } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  const admin = await getSession();
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { competitionId } = await request.json();

    const [comp] = await db
      .select()
      .from(competitions)
      .where(eq(competitions.id, competitionId))
      .limit(1);

    if (!comp) {
      return Response.json({ error: 'Competition not found' }, { status: 404 });
    }

    if (comp.status !== 'live') {
      return Response.json({ error: 'Competition is not live' }, { status: 400 });
    }

    const pct = Math.round((comp.ticketsSold / comp.totalTickets) * 100);
    if (pct < comp.minimumSoldPercentage) {
      const baseDate = comp.originalDrawDate ?? comp.drawDate;
      const capDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const isCapped = new Date() >= capDate;

      if (!isCapped) {
        return Response.json(
          { error: `Threshold not met, ${pct}% sold, needs ${comp.minimumSoldPercentage}%` },
          { status: 400 }
        );
      }
      // Past the 30-day auto-extension cap — an admin can force the draw on
      // tickets actually sold rather than holding customer money forever.
    }

    // Pick a winning ticket using a cryptographically secure random index
    // (Node's crypto.randomInt, a CSPRNG) rather than Postgres's random(),
    // which is a fast but non-cryptographic PRNG - the site's copy promises
    // a "cryptographically secure random number generator" and this is what
    // actually backs that claim.
    const eligibleTicketsQuery = db
      .select({
        ticketId: tickets.id,
        ticketNumber: tickets.ticketNumber,
        userId: tickets.userId,
      })
      .from(tickets)
      .innerJoin(orders, eq(tickets.orderId, orders.id))
      .where(
        and(
          eq(tickets.competitionId, competitionId),
          eq(orders.status, 'paid')
        )
      );

    const [{ count: eligibleCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tickets)
      .innerJoin(orders, eq(tickets.orderId, orders.id))
      .where(
        and(
          eq(tickets.competitionId, competitionId),
          eq(orders.status, 'paid')
        )
      );

    if (!eligibleCount) {
      return Response.json({ error: 'No paid tickets found for this competition' }, { status: 400 });
    }

    const [winningTicket] = await eligibleTicketsQuery
      .orderBy(tickets.ticketNumber)
      .limit(1)
      .offset(randomInt(eligibleCount));

    if (!winningTicket) {
      return Response.json({ error: 'No paid tickets found for this competition' }, { status: 400 });
    }

    // Get winner's details
    const [winner] = await db
      .select({
        name: users.name,
        email: users.email,
        phone: users.phone,
        addressLine1: users.addressLine1,
        addressLine2: users.addressLine2,
        city: users.city,
        postcode: users.postcode,
      })
      .from(users)
      .where(eq(users.id, winningTicket.userId))
      .limit(1);

    // Record the winner
    await db.insert(winners).values({
      id: uuid(),
      competitionId,
      userId: winningTicket.userId,
      ticketId: winningTicket.ticketId,
    });

    // Mark competition as drawn
    await db
      .update(competitions)
      .set({ status: 'drawn', updatedAt: new Date() })
      .where(eq(competitions.id, competitionId));

    return Response.json({
      ticketNumber: winningTicket.ticketNumber,
      winnerName: winner?.name || 'Unknown',
      winnerEmail: winner?.email || 'Unknown',
      winnerPhone: winner?.phone || 'Unknown',
      winnerAddressLine1: winner?.addressLine1 || 'Unknown',
      winnerAddressLine2: winner?.addressLine2 || '',
      winnerCity: winner?.city || 'Unknown',
      winnerPostcode: winner?.postcode || 'Unknown',
      competition: comp.title,
    });
  } catch (error) {
    console.error('Draw error:', error);
    return Response.json({ error: 'Draw failed' }, { status: 500 });
  }
}

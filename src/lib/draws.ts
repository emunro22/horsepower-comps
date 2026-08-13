import { randomInt } from 'crypto';
import { db } from './db';
import { competitions, tickets, users, winners, orders } from './db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export interface DrawResult {
  ticketNumber: number;
  winnerUserId: string;
  winnerName: string;
  winnerEmail: string;
  winnerPhone: string;
  winnerAddressLine1: string;
  winnerAddressLine2: string;
  winnerCity: string;
  winnerPostcode: string;
  competition: string;
}

// Selects a winning ticket using Node's crypto.randomInt (a CSPRNG) rather
// than Postgres's random() - a fast but non-cryptographic PRNG - to back the
// site's "cryptographically secure random number generator" claim. Shared
// between the manual admin draw button and the automatic 30-day-cap draw
// run by the auto-extend cron, so both paths select winners identically.
export async function runDraw(competitionId: string): Promise<DrawResult | { error: string }> {
  const [comp] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  if (!comp) {
    return { error: 'Competition not found' };
  }

  if (comp.status !== 'live' && comp.status !== 'sold_out') {
    return { error: 'Competition is not live' };
  }

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
    return { error: 'No paid tickets found for this competition' };
  }

  const [winningTicket] = await eligibleTicketsQuery
    .orderBy(tickets.ticketNumber)
    .limit(1)
    .offset(randomInt(eligibleCount));

  if (!winningTicket) {
    return { error: 'No paid tickets found for this competition' };
  }

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

  await db.insert(winners).values({
    id: uuid(),
    competitionId,
    userId: winningTicket.userId,
    ticketId: winningTicket.ticketId,
  });

  await db
    .update(competitions)
    .set({ status: 'drawn', updatedAt: new Date() })
    .where(eq(competitions.id, competitionId));

  return {
    ticketNumber: winningTicket.ticketNumber,
    winnerUserId: winningTicket.userId,
    winnerName: winner?.name || 'Unknown',
    winnerEmail: winner?.email || 'Unknown',
    winnerPhone: winner?.phone || 'Unknown',
    winnerAddressLine1: winner?.addressLine1 || 'Unknown',
    winnerAddressLine2: winner?.addressLine2 || '',
    winnerCity: winner?.city || 'Unknown',
    winnerPostcode: winner?.postcode || 'Unknown',
    competition: comp.title,
  };
}

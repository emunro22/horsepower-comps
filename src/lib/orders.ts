import { db } from './db';
import { orders, tickets, competitions, users } from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { sendOrderNotification } from './email';
import { claimInstantWins } from './instant-wins';
import { v4 as uuid } from 'uuid';

// Marks a pending order as paid, issues its tickets, updates the
// competition's sold count, runs instant-win checks, and emails the
// customer. Shared between the Stripe webhook and manual (bank transfer)
// payment confirmation, since both ultimately do the same fulfillment once
// an order is known to be paid.
export async function fulfillOrder(orderId: string, opts: { stripeSessionId?: string } = {}) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.status === 'paid') return;

  await db
    .update(orders)
    .set({ status: 'paid', stripeSessionId: opts.stripeSessionId ?? order.stripeSessionId })
    .where(eq(orders.id, orderId));

  const [comp] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, order.competitionId))
    .limit(1);

  if (!comp) return;

  const startNumber = comp.ticketsSold + 1;
  const issuedTickets: { ticketId: string; ticketNumber: number; userId: string }[] = [];
  for (let i = 0; i < order.quantity; i++) {
    const ticketId = uuid();
    const ticketNumber = startNumber + i;
    await db.insert(tickets).values({
      id: ticketId,
      userId: order.userId,
      competitionId: order.competitionId,
      ticketNumber,
      orderId: order.id,
    });
    issuedTickets.push({ ticketId, ticketNumber, userId: order.userId });
  }

  await db
    .update(competitions)
    .set({
      ticketsSold: sql`${competitions.ticketsSold} + ${order.quantity}`,
      updatedAt: new Date(),
    })
    .where(eq(competitions.id, order.competitionId));

  try {
    await claimInstantWins(order.competitionId, issuedTickets);
  } catch (instantWinError) {
    console.error('Failed to process instant wins:', instantWinError);
  }

  const newSold = comp.ticketsSold + order.quantity;
  if (newSold >= comp.totalTickets) {
    await db.update(competitions).set({ status: 'sold_out' }).where(eq(competitions.id, order.competitionId));
  }

  const [user] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, order.userId))
    .limit(1);

  if (user) {
    try {
      await sendOrderNotification({
        customerName: user.name,
        customerEmail: user.email,
        competitionTitle: comp.title,
        quantity: order.quantity,
        totalPence: order.totalPence,
        orderId: order.id,
      });
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
    }
  }
}

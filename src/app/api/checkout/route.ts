import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions, orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { checkSkillAnswer } from '@/lib/skill-questions';
import { BANK_TRANSFER_DETAILS, generatePaymentReference } from '@/lib/bank-transfer';

interface CartItem {
  competitionId: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return Response.json({ error: 'You must be logged in to checkout' }, { status: 401 });
    }

    const body = await request.json();
    const items: CartItem[] = body.items;
    const skillQuestionId: string | undefined = body.skillQuestionId;
    const skillAnswerIndex: number | undefined = body.skillAnswerIndex;

    if (
      !skillQuestionId ||
      typeof skillAnswerIndex !== 'number' ||
      !checkSkillAnswer(skillQuestionId, skillAnswerIndex)
    ) {
      return Response.json(
        { error: 'Incorrect answer to the skill question, please try again.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderRecords: { id: string; competitionId: string; quantity: number; totalPence: number; competitionTitle: string }[] = [];

    for (const item of items) {
      const [comp] = await db
        .select()
        .from(competitions)
        .where(eq(competitions.id, item.competitionId))
        .limit(1);

      if (!comp || comp.status !== 'live') {
        return Response.json({ error: `Competition not available` }, { status: 400 });
      }

      const remaining = comp.totalTickets - comp.ticketsSold;
      if (item.quantity > remaining) {
        return Response.json(
          { error: `Only ${remaining} tickets remaining for ${comp.title}` },
          { status: 400 }
        );
      }

      if (item.quantity > comp.maxPerPerson) {
        return Response.json(
          { error: `Maximum ${comp.maxPerPerson} tickets per person for ${comp.title}` },
          { status: 400 }
        );
      }

      const totalPence = comp.ticketPrice * item.quantity;
      const orderId = uuid();

      orderRecords.push({
        id: orderId,
        competitionId: comp.id,
        quantity: item.quantity,
        totalPence,
        competitionTitle: comp.title,
      });
    }

    // Card payments are temporarily unavailable, so orders are created as
    // pending and fulfilled manually once a matching bank transfer is
    // confirmed in the admin orders screen (see /admin/orders).
    const paymentReference = generatePaymentReference();
    const totalPence = orderRecords.reduce((sum, r) => sum + r.totalPence, 0);

    for (const record of orderRecords) {
      await db.insert(orders).values({
        id: record.id,
        userId: user.id,
        competitionId: record.competitionId,
        quantity: record.quantity,
        totalPence: record.totalPence,
        status: 'pending',
        paymentReference,
      });
    }

    return Response.json({
      bankTransfer: {
        reference: paymentReference,
        totalPence,
        ...BANK_TRANSFER_DETAILS,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Failed to create your order' }, { status: 500 });
  }
}

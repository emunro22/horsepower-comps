import { getSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { competitions, orders } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { checkSkillAnswer } from '@/lib/skill-questions';

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

    const lineItems: { price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number }; quantity: number }[] = [];
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

      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${comp.title}, ${item.quantity} ticket${item.quantity > 1 ? 's' : ''}`,
            description: `Competition entry tickets`,
          },
          unit_amount: comp.ticketPrice,
        },
        quantity: item.quantity,
      });

      orderRecords.push({
        id: orderId,
        competitionId: comp.id,
        quantity: item.quantity,
        totalPence,
        competitionTitle: comp.title,
      });
    }

    // Create pending orders in DB
    for (const record of orderRecords) {
      await db.insert(orders).values({
        id: record.id,
        userId: user.id,
        competitionId: record.competitionId,
        quantity: record.quantity,
        totalPence: record.totalPence,
        status: 'pending',
      });
    }

    const origin = request.headers.get('origin') || 'https://horsepowercomps.co.uk';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: user.id,
        userName: user.name,
        orderIds: orderRecords.map((o) => o.id).join(','),
      },
      success_url: `${origin}/account/tickets?success=true`,
      cancel_url: `${origin}/competitions?cancelled=true`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

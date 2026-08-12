import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { wheelSpins, wheelGames, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendSpinOrderNotification } from '@/lib/email';
import { resolveSpin } from '@/lib/wheel';
import { markOrderPaid } from '@/lib/orders';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, orderIds, spinId } = session.metadata || {};

    if (spinId) {
      const [spin] = await db.select().from(wheelSpins).where(eq(wheelSpins.id, spinId)).limit(1);

      if (spin && spin.status !== 'paid') {
        await db
          .update(wheelSpins)
          .set({ status: 'paid', stripeSessionId: session.id })
          .where(eq(wheelSpins.id, spinId));

        const [game] = await db.select().from(wheelGames).where(eq(wheelGames.id, spin.gameId)).limit(1);
        const [user] = await db
          .select({ name: users.name, email: users.email })
          .from(users)
          .where(eq(users.id, spin.userId))
          .limit(1);

        if (game && user) {
          try {
            await sendSpinOrderNotification({
              customerName: user.name,
              customerEmail: user.email,
              gameTitle: game.title,
              pricePence: spin.pricePence,
            });
          } catch (emailError) {
            console.error('Failed to send spin order notification email:', emailError);
          }
        }

        try {
          await resolveSpin(spin.gameId, spin.id, spin.userId, spin.pricePence);
        } catch (spinError) {
          console.error('Failed to resolve wheel spin:', spinError);
        }
      }

      return Response.json({ received: true });
    }

    if (!userId || !orderIds) {
      console.error('Missing metadata in checkout session');
      return Response.json({ received: true });
    }

    const orderIdList = orderIds.split(',');

    for (const orderId of orderIdList) {
      await markOrderPaid(orderId, { stripeSessionId: session.id });
    }
  }

  return Response.json({ received: true });
}

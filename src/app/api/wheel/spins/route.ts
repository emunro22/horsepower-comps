import { requireVerifiedUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { wheelGames, wheelSpins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireVerifiedUser();
    if (authError) return authError;

    const body = await request.json();
    const gameId: string | undefined = body.gameId;

    if (!gameId) {
      return Response.json({ error: 'Missing gameId' }, { status: 400 });
    }

    const [game] = await db.select().from(wheelGames).where(eq(wheelGames.id, gameId)).limit(1);

    if (!game || game.status !== 'live') {
      return Response.json({ error: 'This game is not available' }, { status: 400 });
    }

    const spinId = uuid();

    await db.insert(wheelSpins).values({
      id: spinId,
      gameId: game.id,
      userId: user.id,
      pricePence: game.pricePerSpin,
      status: 'pending',
    });

    const origin = request.headers.get('origin') || 'https://horsepowercomps.co.uk';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${game.title} - Spin`,
              description: 'Wheel game spin',
            },
            unit_amount: game.pricePerSpin,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        spinId,
      },
      success_url: `${origin}/instawin/${game.slug}?spin=${spinId}`,
      cancel_url: `${origin}/instawin/${game.slug}?cancelled=true`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Wheel spin checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, competitions, marketingCampaigns } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getOrCreateCampaignSettings, nextSendDate, POPULAR_NEWEST_CAMPAIGN_ID } from '@/lib/marketing-email';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getOrCreateCampaignSettings();

    const [recipientCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.emailVerified, true));

    const [popular] = await db
      .select({ id: competitions.id, title: competitions.title, ticketsSold: competitions.ticketsSold })
      .from(competitions)
      .where(eq(competitions.status, 'live'))
      .orderBy(sql`${competitions.ticketsSold} desc`)
      .limit(1);

    const [newest] = await db
      .select({ id: competitions.id, title: competitions.title, createdAt: competitions.createdAt })
      .from(competitions)
      .where(eq(competitions.status, 'live'))
      .orderBy(sql`${competitions.createdAt} desc`)
      .limit(1);

    return Response.json({
      enabled: settings.enabled,
      intervalDays: settings.intervalDays,
      lastSentAt: settings.lastSentAt,
      lastRecipientCount: settings.lastRecipientCount,
      nextSendAt: nextSendDate(settings.lastSentAt, settings.intervalDays),
      recipientCount: recipientCount?.count ?? 0,
      popularCompetition: popular ?? null,
      newestCompetition: newest && newest.id !== popular?.id ? newest : null,
    });
  } catch (error) {
    console.error('Marketing campaign status error:', error);
    return Response.json({ error: 'Failed to load campaign status' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: { enabled?: boolean; intervalDays?: number; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (typeof body.enabled === 'boolean') updates.enabled = body.enabled;
    if (typeof body.intervalDays === 'number' && body.intervalDays >= 1) {
      updates.intervalDays = Math.round(body.intervalDays);
    }

    await getOrCreateCampaignSettings();
    await db
      .update(marketingCampaigns)
      .set(updates)
      .where(eq(marketingCampaigns.id, POPULAR_NEWEST_CAMPAIGN_ID));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Marketing campaign update error:', error);
    return Response.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

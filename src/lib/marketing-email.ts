import { db } from './db';
import { users, competitions, marketingCampaigns } from './db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { sendCampaignEmailBatch } from './email';

export const POPULAR_NEWEST_CAMPAIGN_ID = 'popular-newest';

export async function getOrCreateCampaignSettings() {
  const [existing] = await db
    .select()
    .from(marketingCampaigns)
    .where(eq(marketingCampaigns.id, POPULAR_NEWEST_CAMPAIGN_ID));

  if (existing) return existing;

  const [created] = await db
    .insert(marketingCampaigns)
    .values({
      id: POPULAR_NEWEST_CAMPAIGN_ID,
      name: 'Popular & Newest Competition',
      enabled: true,
      intervalDays: 30,
    })
    .returning();

  return created;
}

async function getFeaturedCompetitions() {
  const [popular] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.status, 'live'))
    .orderBy(desc(competitions.ticketsSold))
    .limit(1);

  if (!popular) return { popular: null, newest: null };

  const [newest] = await db
    .select()
    .from(competitions)
    .where(and(eq(competitions.status, 'live'), ne(competitions.id, popular.id)))
    .orderBy(desc(competitions.createdAt))
    .limit(1);

  return { popular, newest: newest ?? null };
}

async function getRecipients() {
  return db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.emailVerified, true));
}

export function nextSendDate(lastSentAt: Date | null, intervalDays: number) {
  if (!lastSentAt) return new Date();
  return new Date(lastSentAt.getTime() + intervalDays * 24 * 60 * 60 * 1000);
}

/**
 * Sends the campaign immediately regardless of schedule, and stamps
 * lastSentAt to now. Used by both the cron job (once due) and the admin
 * "Send Now" button (explicit override).
 */
export async function runCampaignNow() {
  const { popular, newest } = await getFeaturedCompetitions();
  if (!popular) {
    return { sent: 0, reason: 'no_live_competitions' as const };
  }

  const recipients = await getRecipients();
  if (recipients.length === 0) {
    return { sent: 0, reason: 'no_recipients' as const };
  }

  const sent = await sendCampaignEmailBatch(recipients, popular, newest);

  await db
    .update(marketingCampaigns)
    .set({ lastSentAt: new Date(), lastRecipientCount: sent, updatedAt: new Date() })
    .where(eq(marketingCampaigns.id, POPULAR_NEWEST_CAMPAIGN_ID));

  return {
    sent,
    reason: 'sent' as const,
    popular: { title: popular.title, slug: popular.slug },
    newest: newest ? { title: newest.title, slug: newest.slug } : null,
  };
}

/**
 * Called by the daily cron trigger. Only actually sends once intervalDays
 * has elapsed since lastSentAt (or immediately on first-ever run), which is
 * how a daily cron produces a rolling 30-day cadence starting from today.
 */
export async function runScheduledCampaignIfDue() {
  const settings = await getOrCreateCampaignSettings();

  if (!settings.enabled) {
    return { skipped: true, reason: 'disabled' as const };
  }

  const due = nextSendDate(settings.lastSentAt, settings.intervalDays);
  if (due.getTime() > Date.now()) {
    return { skipped: true, reason: 'not_due' as const, nextSendAt: due.toISOString() };
  }

  const result = await runCampaignNow();
  return { skipped: false, ...result };
}

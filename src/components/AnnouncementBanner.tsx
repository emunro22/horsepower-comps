import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils';
import AnnouncementMarquee from './AnnouncementMarquee';

const GENERIC_MESSAGES = [
  'Tickets from just £1 — enter now',
  'New competitions launching soon',
  '100% Verified Draws — real winners every week',
];

async function getLiveCompetitionMessages() {
  try {
    const rows = await db
      .select({ title: competitions.title, ticketPrice: competitions.ticketPrice })
      .from(competitions)
      .where(eq(competitions.status, 'live'))
      .orderBy(desc(competitions.featured), desc(competitions.createdAt))
      .limit(10);

    return rows.map((c) => `${c.title} — tickets from ${formatPrice(c.ticketPrice)}`);
  } catch (error) {
    console.error('Announcement banner competitions error:', error);
    return [];
  }
}

export default async function AnnouncementBanner() {
  const competitionMessages = await getLiveCompetitionMessages();

  const messages = [
    GENERIC_MESSAGES[0],
    ...competitionMessages,
    ...GENERIC_MESSAGES.slice(1),
  ];

  return <AnnouncementMarquee messages={messages} />;
}
